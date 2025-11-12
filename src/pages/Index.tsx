import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/ProjectCard";
import { ArrowRight, Package, Award, Users } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-architecture.jpg";

const Index = () => {
  const featuredProjects = [
    {
      title: "Museo de Arte Contemporáneo",
      author: "María González",
      category: "Renders",
      poaps: 12,
      imageUrl: "https://images.unsplash.com/photo-1487958449943-2429e8be8625",
      authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=maria"
    },
    {
      title: "Complejo Residencial Verde",
      author: "Carlos Ruiz",
      category: "Planos",
      poaps: 8,
      imageUrl: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2",
      authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=carlos"
    },
    {
      title: "Biblioteca Universitaria",
      author: "Ana Martínez",
      category: "Maquetas",
      poaps: 15,
      imageUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e",
      authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ana"
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-90 z-0" />
        <img 
          src={heroImage} 
          alt="Hero" 
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
        />
        
        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              El GitHub para Arquitectos
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Comparte tus proyectos, obtén POAPs en blockchain y conecta con la comunidad arquitectónica global.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" variant="secondary" className="gap-2" asChild>
                <Link to="/explore">
                  Explorar Proyectos
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                Subir Proyecto
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Package className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Repositorios de Proyectos</h3>
              <p className="text-muted-foreground">
                Organiza renders, planos, maquetas y fotos en repositorios profesionales
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">POAPs Blockchain</h3>
              <p className="text-muted-foreground">
                Recibe certificados NFT por cada proyecto publicado en Polkadot
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Comunidad Global</h3>
              <p className="text-muted-foreground">
                Conecta con estudiantes y profesionales de arquitectura del mundo
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Proyectos Destacados</h2>
              <p className="text-muted-foreground">Descubre los trabajos más recientes de la comunidad</p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/explore">Ver todos</Link>
            </Button>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project, index) => (
              <ProjectCard key={index} {...project} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <span className="font-semibold">ArchiRepo</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Powered by Polkadot & Astar Network
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
