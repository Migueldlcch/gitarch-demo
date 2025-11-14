import { useWallet } from "@/hooks/useWallet";
import { Activity, Wifi, WifiOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";

/**
 * Indicador de estado de red Shibuya
 * Muestra: conectado/desconectado, altura de bloque, cuenta activa
 */
export const NetworkIndicator = () => {
  const { api, isApiReady, selectedAccount } = useWallet();
  const [blockNumber, setBlockNumber] = useState<number>(0);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!isApiReady || !api) {
      setIsConnected(false);
      return;
    }

    setIsConnected(true);

    // Suscribirse a nuevos bloques para mostrar altura actual
    const unsubscribe = api.rpc.chain.subscribeNewHeads((header) => {
      setBlockNumber(header.number.toNumber());
    });

    return () => {
      unsubscribe.then((unsub) => unsub());
    };
  }, [api, isApiReady]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2">
            <Badge 
              variant={isConnected ? "default" : "secondary"} 
              className="gap-1.5 font-mono text-xs"
            >
              {isConnected ? (
                <>
                  <Wifi className="h-3 w-3" />
                  <span className="hidden sm:inline">Shibuya</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3" />
                  <span className="hidden sm:inline">Desconectado</span>
                </>
              )}
            </Badge>
            
            {isConnected && blockNumber > 0 && (
              <Badge variant="outline" className="gap-1 font-mono text-xs">
                <Activity className="h-3 w-3" />
                <span className="hidden md:inline">#{blockNumber.toLocaleString()}</span>
              </Badge>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1 text-xs">
            <p><strong>Red:</strong> {isConnected ? 'Shibuya Testnet' : 'Desconectada'}</p>
            {isConnected && <p><strong>Bloque:</strong> #{blockNumber.toLocaleString()}</p>}
            {selectedAccount && (
              <p className="font-mono">
                <strong>Cuenta:</strong> {selectedAccount.address.slice(0, 6)}...{selectedAccount.address.slice(-4)}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
