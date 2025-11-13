import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { ProjectCard } from "@/components/ProjectCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, MapPin } from "lucide-react";

interface Profile {
  username: string;
  bio: string | null;
  university: string | null;
  avatar_url: string | null;
  wallet_address: string | null;
}

interface Project {
  id: string;
  title: string;
  category: string;
  image_urls: string[];
  created_at: string;
}

interface Poap {
  id: string;
  created_at: string;
  token_id: string;
  transaction_hash: string;
  projects: {
    title: string;
    image_urls: string[];
    category: string;
  };
}

const Profile = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [poaps, setPoaps] = useState<Poap[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!username) return;

      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', username)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);

        const { data: projectsData } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', profileData.id)
          .order('created_at', { ascending: false });

        setProjects(projectsData || []);

        const { data: poapsData, error: poapsError } = await supabase
          .from('poaps')
          .select(`
            *,
            projects (
              title,
              image_urls,
              category
            )
          `)
          .eq('user_id', profileData.id)
          .order('created_at', { ascending: false });

        if (poapsError) {
          console.error('Error fetching POAPs:', poapsError);
        }

        setPoaps(poapsData || []);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Perfil no encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.avatar_url || undefined} />
                <AvatarFallback className="text-2xl">
                  {profile.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{profile.username}</h1>
                  {profile.bio && (
                    <p className="text-muted-foreground">{profile.bio}</p>
                  )}
                </div>

                <div className="flex flex-wrap gap-4">
                  {profile.university && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {profile.university}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Award className="h-4 w-4" />
                    {poaps.length} POAPs
                  </div>
                </div>

                {profile.wallet_address && (
                  <Badge variant="outline" className="font-mono text-xs">
                    {profile.wallet_address.slice(0, 6)}...{profile.wallet_address.slice(-4)}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="projects" className="w-full">
          <TabsList>
            <TabsTrigger value="projects">
              Proyectos ({projects.length})
            </TabsTrigger>
            <TabsTrigger value="poaps">
              POAPs ({poaps.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="mt-6">
            {projects.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    id={project.id}
                    title={project.title}
                    author={profile.username}
                    category={project.category}
                    poaps={0}
                    imageUrl={project.image_urls[0]}
                    authorAvatar={profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No hay proyectos publicados
              </p>
            )}
          </TabsContent>

          <TabsContent value="poaps" className="mt-6">
            {poaps.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {poaps.map((poap) => (
                  <Card key={poap.id} className="overflow-hidden">
                    <div className="relative h-48">
                      <img 
                        src={poap.projects?.image_urls?.[0] || "https://images.unsplash.com/photo-1511818966892-d7d671e672a2"}
                        alt={poap.projects?.title || "POAP"}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-primary/90 backdrop-blur">
                          <Award className="h-3 w-3 mr-1" />
                          POAP
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">{poap.projects?.title || "Sin título"}</h3>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <p>Token: {poap.token_id?.slice(0, 10)}...</p>
                        <p>{new Date(poap.created_at).toLocaleDateString('es-MX')}</p>
                        {poap.projects?.category && (
                          <Badge variant="secondary" className="text-xs">
                            {poap.projects.category}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No hay POAPs ganados aún
              </p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
