import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { projectId, userId } = await req.json();

    console.log('Minting POAP for project:', projectId, 'user:', userId);

    // Verificar que el proyecto existe y obtener datos
    const { data: project, error: projectError } = await supabaseClient
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (projectError || !project) {
      throw new Error('Proyecto no encontrado');
    }

    // Verificar que el usuario existe
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('wallet_address')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      throw new Error('Usuario no encontrado');
    }

    if (!profile.wallet_address) {
      throw new Error('Usuario no tiene wallet conectada');
    }

    console.log('Preparing to mint POAP on Shibuya...');

    // Crear metadata para el POAP
    const metadata = {
      name: `POAP - ${project.title}`,
      description: project.description || 'POAP NFT generado por GitArch',
      image: project.image_urls[0] || '',
      attributes: [
        { trait_type: 'Category', value: project.category },
        { trait_type: 'University', value: project.university || 'N/A' },
        { trait_type: 'Created At', value: project.created_at }
      ]
    };

    // Guardar metadata en IPFS o similar (por ahora usaremos una URL temporal)
    // En producción, deberías subir esto a IPFS
    const metadataUri = `data:application/json;base64,${btoa(JSON.stringify(metadata))}`;

    // Simular transacción de minteo
    // En un contrato real, aquí llamarías al método mint del contrato PSP34
    const contractAddress = '0x0000000000000000000000000000000000000000'; // Placeholder
    const txHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    const tokenId = Date.now().toString();

    console.log('Transaction simulated:', txHash);

    // Guardar POAP en la base de datos
    const { error: insertError } = await supabaseClient
      .from('poaps')
      .insert({
        user_id: userId,
        project_id: projectId,
        transaction_hash: txHash,
        metadata_uri: metadataUri,
        token_id: tokenId,
        contract_address: contractAddress
      });

    if (insertError) {
      throw insertError;
    }

    // Marcar proyecto como que tiene POAP generado
    await supabaseClient
      .from('projects')
      .update({ poap_generated: true })
      .eq('id', projectId);

    return new Response(
      JSON.stringify({ 
        success: true,
        txHash,
        tokenId,
        metadataUri,
        message: 'POAP minted successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error minting POAP:', error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Error desconocido' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
