import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Award, Calendar, School } from "lucide-react";
import type { Session } from "@supabase/supabase-js";

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [minting, setMinting] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url,
            university
          ),
          poaps (
            id,
            token_id,
            transaction_hash,
            created_at
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setProject(data);
    } catch (error: any) {
      console.error('Error fetching project:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar el proyecto",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMintPoap = async () => {
    if (!session?.user) {
      toast({
        title: "Autenticación requerida",
        description: "Debes iniciar sesión para generar un POAP",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }

    setMinting(true);
    try {
      const { data, error } = await supabase.functions.invoke('mint-poap', {
        body: {
          projectId: id,
          userId: session.user.id
        }
      });

      if (error) throw error;

      toast({
        title: "¡POAP generado!",
        description: `Tu POAP NFT ha sido minteado en Shibuya. Token ID: ${data.tokenId}`,
      });

      // Recargar proyecto para mostrar el nuevo POAP
      fetchProject();
    } catch (error: any) {
      console.error('Error minting POAP:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo generar el POAP",
        variant: "destructive"
      });
    } finally {
      setMinting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">Cargando proyecto...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">Proyecto no encontrado</p>
        </div>
      </div>
    );
  }

  const isOwner = session?.user?.id === project.user_id;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card>
              <CardContent className="p-0">
                <img 
                  src={project.image_urls?.[0] || "https://images.unsplash.com/photo-1511818966892-d7d671e672a2"}
                  alt={project.title}
                  className="w-full h-[400px] object-cover rounded-t-lg"
                />
                {project.image_urls?.length > 1 && (
                  <div className="grid grid-cols-4 gap-2 p-4">
                    {project.image_urls.slice(1, 5).map((url: string, idx: number) => (
                      <img 
                        key={idx}
                        src={url}
                        alt={`${project.title} ${idx + 2}`}
                        className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Project Info */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(project.created_at).toLocaleDateString('es-MX')}
                    </div>
                    {project.university && (
                      <div className="flex items-center gap-1">
                        <School className="h-4 w-4" />
                        {project.university}
                      </div>
                    )}
                  </div>
                </div>
                <Badge>{project.category}</Badge>
              </div>

              <p className="text-foreground/80 mb-4">{project.description}</p>

              {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag: string, idx: number) => (
                    <Badge key={idx} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Author Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={project.profiles?.avatar_url} />
                    <AvatarFallback>{project.profiles?.username?.[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{project.profiles?.username}</p>
                    <p className="text-sm text-muted-foreground">Autor</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate(`/profile/${project.profiles?.username}`)}
                >
                  Ver perfil
                </Button>
              </CardContent>
            </Card>

            {/* POAP Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">POAPs NFT</h3>
                </div>
                
                <p className="text-2xl font-bold mb-2">
                  {project.poaps?.length || 0}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  POAPs generados
                </p>

                {!isOwner && (
                  <Button 
                    onClick={handleMintPoap}
                    disabled={minting}
                    className="w-full"
                  >
                    {minting ? "Generando..." : "Generar mi POAP"}
                  </Button>
                )}

                {project.poaps && project.poaps.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm font-medium mb-2">POAPs recientes:</p>
                    <div className="space-y-2">
                      {project.poaps.slice(0, 3).map((poap: any) => (
                        <div key={poap.id} className="text-xs text-muted-foreground">
                          Token #{poap.token_id?.slice(0, 8)}...
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
