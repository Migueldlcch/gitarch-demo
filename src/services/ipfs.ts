/**
 * Servicio IPFS usando Pinata (GRATIS hasta 1GB)
 * 
 * CONFIGURACIÓN:
 * 1. Crear cuenta en https://pinata.cloud (gratis)
 * 2. Obtener API Key en Dashboard > API Keys
 * 3. Agregar VITE_PINATA_API_KEY y VITE_PINATA_SECRET_KEY en .env
 * 
 * ALTERNATIVA GRATUITA: NFT.Storage (sin límites)
 */

const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
const PINATA_SECRET_KEY = import.meta.env.VITE_PINATA_SECRET_KEY;
const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;

interface PoapMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
}

/**
 * Sube una imagen a IPFS usando Pinata
 * @param file - Archivo de imagen
 * @returns IPFS hash (CID)
 */
export const uploadImageToIPFS = async (file: File): Promise<string> => {
  if (!PINATA_JWT && !PINATA_API_KEY) {
    console.warn('IPFS no configurado. Usando URL temporal.');
    return URL.createObjectURL(file);
  }

  const formData = new FormData();
  formData.append('file', file);

  const headers: HeadersInit = PINATA_JWT 
    ? { 'Authorization': `Bearer ${PINATA_JWT}` }
    : {
        'pinata_api_key': PINATA_API_KEY!,
        'pinata_secret_api_key': PINATA_SECRET_KEY!,
      };

  const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Error subiendo imagen a IPFS');
  }

  const data = await response.json();
  return `ipfs://${data.IpfsHash}`;
};

/**
 * Sube metadata JSON a IPFS
 * @param metadata - Metadata del POAP
 * @returns IPFS URI completo
 */
export const uploadMetadataToIPFS = async (metadata: PoapMetadata): Promise<string> => {
  if (!PINATA_JWT && !PINATA_API_KEY) {
    console.warn('IPFS no configurado. Usando data URI.');
    return `data:application/json;base64,${btoa(JSON.stringify(metadata))}`;
  }

  const headers: HeadersInit = PINATA_JWT
    ? {
        'Authorization': `Bearer ${PINATA_JWT}`,
        'Content-Type': 'application/json',
      }
    : {
        'pinata_api_key': PINATA_API_KEY!,
        'pinata_secret_api_key': PINATA_SECRET_KEY!,
        'Content-Type': 'application/json',
      };

  const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      pinataContent: metadata,
      pinataMetadata: {
        name: `${metadata.name}.json`,
      },
    }),
  });

  if (!response.ok) {
    throw new Error('Error subiendo metadata a IPFS');
  }

  const data = await response.json();
  return `ipfs://${data.IpfsHash}`;
};

/**
 * Convierte IPFS URI a HTTP URL usando gateway público
 */
export const ipfsToHttp = (ipfsUri: string): string => {
  if (ipfsUri.startsWith('ipfs://')) {
    return ipfsUri.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
  }
  return ipfsUri;
};

/**
 * Crea metadata completa para un POAP
 */
export const createPoapMetadata = (
  projectTitle: string,
  projectDescription: string,
  imageIpfsUri: string,
  category: string,
  university?: string
): PoapMetadata => {
  return {
    name: `GitArch POAP - ${projectTitle}`,
    description: projectDescription || 'POAP NFT generado por GitArch para proyecto de arquitectura',
    image: imageIpfsUri,
    attributes: [
      { trait_type: 'Category', value: category },
      { trait_type: 'University', value: university || 'N/A' },
      { trait_type: 'Platform', value: 'GitArch' },
      { trait_type: 'Network', value: 'Shibuya Testnet' },
      { trait_type: 'Minted At', value: new Date().toISOString() },
    ],
  };
};
