import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Plus, Award, Package, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8 p-6 bg-card rounded-lg border border-border shadow-card">
          <Avatar className="h-24 w-24">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" />
            <AvatarFallback>AR</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">Arquitecto Demo</h1>
            <p className="text-muted-foreground mb-3">Estudiante de Arquitectura</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">0x1a2b...3c4d</Badge>
              <Badge variant="outline" className="gap-1">
                <Award className="h-3 w-3" />
                24 POAPs
              </Badge>
            </div>
          </div>
          
          <Button className="gap-2" asChild>
            <Link to="/upload">
              <Plus className="h-4 w-4" />
              Nuevo Proyecto
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Proyectos
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+2 este mes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                POAPs Ganados
              </CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">En blockchain</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Vistas Totales
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">+12% este mes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Seguidores
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">+7 nuevos</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Projects */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Mis Proyectos</h2>
            <Button variant="outline" asChild>
              <Link to="/upload">Subir nuevo</Link>
            </Button>
          </div>

          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="hover:shadow-elegant transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 rounded bg-muted flex items-center justify-center">
                      <Package className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">Proyecto {i}</h3>
                          <p className="text-sm text-muted-foreground">Actualizado hace 2 días</p>
                        </div>
                        <Badge variant="secondary">Renders</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Award className="h-4 w-4" />
                          {i * 3} POAPs
                        </span>
                        <span>128 vistas</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
