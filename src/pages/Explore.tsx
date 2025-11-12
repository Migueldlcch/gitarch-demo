import { Navbar } from "@/components/Navbar";
import { ProjectCard } from "@/components/ProjectCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";

const Explore = () => {
  const projects = [
    {
      title: "Centro Cultural Moderno",
      author: "Laura Sánchez",
      category: "Renders",
      poaps: 10,
      imageUrl: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2",
      authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=laura"
    },
    {
      title: "Vivienda Sostenible",
      author: "Pedro López",
      category: "Planos",
      poaps: 6,
      imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=pedro"
    },
    {
      title: "Parque Urbano",
      author: "Sofia Torres",
      category: "Maquetas",
      poaps: 14,
      imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
      authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sofia"
    },
    {
      title: "Edificio Corporativo",
      author: "Miguel Ángel",
      category: "Renders",
      poaps: 9,
      imageUrl: "https://images.unsplash.com/photo-1487958449943-2429e8be8625",
      authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=miguel"
    },
    {
      title: "Casa Minimalista",
      author: "Elena Ramírez",
      category: "Secciones",
      poaps: 11,
      imageUrl: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3",
      authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=elena"
    },
    {
      title: "Complejo Deportivo",
      author: "Roberto Chen",
      category: "Renders",
      poaps: 13,
      imageUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e",
      authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=roberto"
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Explorar Proyectos</h1>
          
          {/* Search Bar */}
          <div className="flex gap-3 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar proyectos, autores, categorías..." 
                className="pl-9"
              />
            </div>
            <Button>Buscar</Button>
          </div>
        </div>

        {/* Filters */}
        <Tabs defaultValue="all" className="mb-8">
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="renders">Renders</TabsTrigger>
            <TabsTrigger value="planos">Planos</TabsTrigger>
            <TabsTrigger value="maquetas">Maquetas</TabsTrigger>
            <TabsTrigger value="secciones">Secciones</TabsTrigger>
            <TabsTrigger value="fotos">Fotos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <ProjectCard key={index} {...project} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="renders" className="mt-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.filter(p => p.category === "Renders").map((project, index) => (
                <ProjectCard key={index} {...project} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="planos" className="mt-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.filter(p => p.category === "Planos").map((project, index) => (
                <ProjectCard key={index} {...project} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="maquetas" className="mt-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.filter(p => p.category === "Maquetas").map((project, index) => (
                <ProjectCard key={index} {...project} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="secciones" className="mt-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.filter(p => p.category === "Secciones").map((project, index) => (
                <ProjectCard key={index} {...project} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="fotos" className="mt-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Add photo projects here */}
              <p className="text-muted-foreground col-span-full text-center py-8">
                No hay proyectos de fotos disponibles
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Explore;
