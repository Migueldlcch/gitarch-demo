import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { ProjectCard } from "@/components/ProjectCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const Explore = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedUniversity, setSelectedUniversity] = useState("all");
  const [universities, setUniversities] = useState<string[]>([]);

  useEffect(() => {
    fetchProjects();
    fetchUniversities();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          profiles!user_id (
            username,
            avatar_url
          ),
          poaps (count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedProjects = data?.map(project => {
        const profile = Array.isArray(project.profiles) ? project.profiles[0] : project.profiles;
        return {
          id: project.id,
          title: project.title,
          author: profile?.username || 'Usuario',
          category: project.category,
          poaps: project.poaps?.[0]?.count || 0,
          imageUrl: project.image_urls?.[0] || "https://images.unsplash.com/photo-1511818966892-d7d671e672a2",
          authorAvatar: profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${project.user_id}`,
          university: project.university,
          tags: project.tags || [],
          created_at: project.created_at
        };
      }) || [];

      setProjects(formattedProjects);
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los proyectos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUniversities = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('university')
        .not('university', 'is', null);

      if (error) throw error;

      const uniqueUniversities = [...new Set(data?.map(p => p.university).filter(Boolean))] as string[];
      setUniversities(uniqueUniversities);
    } catch (error) {
      console.error('Error fetching universities:', error);
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = searchTerm === "" || 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.tags?.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === "all" || 
      project.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesUniversity = selectedUniversity === "all" || 
      project.university === selectedUniversity;

    return matchesSearch && matchesCategory && matchesUniversity;
  });

  const handleSearch = () => {
    // La búsqueda ya está siendo filtrada en tiempo real
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Explorar Proyectos</h1>
          
          {/* Search Bar */}
          <div className="flex gap-3 max-w-2xl mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar proyectos, autores, etiquetas..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={handleSearch}>Buscar</Button>
          </div>

          {/* Advanced Filters */}
          <div className="flex gap-3 max-w-2xl items-center">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedUniversity} onValueChange={setSelectedUniversity}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Universidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las universidades</SelectItem>
                {universities.map(uni => (
                  <SelectItem key={uni} value={uni}>{uni}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filters */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList>
            <TabsTrigger value="all">Todos ({projects.length})</TabsTrigger>
            <TabsTrigger value="renders">Renders</TabsTrigger>
            <TabsTrigger value="planos">Planos</TabsTrigger>
            <TabsTrigger value="maquetas">Maquetas</TabsTrigger>
            <TabsTrigger value="secciones">Secciones</TabsTrigger>
            <TabsTrigger value="fotos">Fotos</TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Cargando proyectos...</p>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No se encontraron proyectos</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} {...project} />
                ))}
              </div>
            )}
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Explore;
