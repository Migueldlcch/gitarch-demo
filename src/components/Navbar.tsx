import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Package, User, Search } from "lucide-react";
import { WalletConnect } from "./WalletConnect";
import { NetworkIndicator } from "./NetworkIndicator";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

export const Navbar = () => {
  const navigate = useNavigate();
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

  const handlePublish = () => {
    if (!session) {
      navigate("/auth");
    } else {
      navigate("/upload");
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">GitArch</span>
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
          <NetworkIndicator />
          
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Search className="h-5 w-5" />
          </Button>
          
          <WalletConnect />
          
          <Button onClick={handlePublish}>Publicar</Button>
          
          <Button variant="ghost" size="icon" onClick={() => navigate(session ? "/dashboard" : "/auth")}>
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
};
