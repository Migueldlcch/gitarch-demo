import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Package, Wallet, User, Search } from "lucide-react";

export const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">ArchiRepo</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <Link to="/explore" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Explorar
            </Link>
            <Link to="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Search className="h-5 w-5" />
          </Button>
          
          <Button variant="outline" className="gap-2">
            <Wallet className="h-4 w-4" />
            <span className="hidden sm:inline">Conectar Wallet</span>
          </Button>
          
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
};
