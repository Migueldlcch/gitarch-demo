import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const WalletConnect = () => {
  const { selectedAccount, isConnecting, connectWallet, disconnectWallet, isConnected } = useWallet();

  if (!isConnected) {
    return (
      <Button onClick={connectWallet} disabled={isConnecting} variant="outline">
        <Wallet className="mr-2 h-4 w-4" />
        {isConnecting ? "Conectando..." : "Conectar Wallet"}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Wallet className="mr-2 h-4 w-4" />
          {selectedAccount?.meta.name || "Cuenta conectada"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem disabled className="text-xs text-muted-foreground">
          {selectedAccount?.address.slice(0, 6)}...{selectedAccount?.address.slice(-4)}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={disconnectWallet} className="text-destructive">
          Desconectar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
