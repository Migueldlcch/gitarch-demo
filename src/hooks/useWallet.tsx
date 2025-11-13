import { useState, useEffect } from 'react';
import { web3Accounts, web3Enable, web3FromAddress } from '@polkadot/extension-dapp';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { toast } from '@/hooks/use-toast';

const SHIBUYA_WSS = 'wss://shibuya.public.blastapi.io';

export const useWallet = () => {
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<InjectedAccountWithMeta | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [api, setApi] = useState<ApiPromise | null>(null);
  const [isApiReady, setIsApiReady] = useState(false);

  // Conectar a Shibuya testnet
  useEffect(() => {
    const connectToShibuya = async () => {
      try {
        const provider = new WsProvider(SHIBUYA_WSS);
        const api = await ApiPromise.create({ provider });
        await api.isReady;
        setApi(api);
        setIsApiReady(true);
        console.log('Connected to Shibuya testnet');
      } catch (error) {
        console.error('Error connecting to Shibuya:', error);
      }
    };

    connectToShibuya();

    return () => {
      if (api) {
        api.disconnect();
      }
    };
  }, []);

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      const extensions = await web3Enable('GitArch');
      
      if (extensions.length === 0) {
        toast({
          title: "Wallet no encontrada",
          description: "Por favor instala Polkadot.js extension",
          variant: "destructive"
        });
        return;
      }

      const allAccounts = await web3Accounts();
      
      if (allAccounts.length === 0) {
        toast({
          title: "No hay cuentas",
          description: "Por favor crea una cuenta en tu wallet",
          variant: "destructive"
        });
        return;
      }

      setAccounts(allAccounts);
      setSelectedAccount(allAccounts[0]);
      
      toast({
        title: "Wallet conectada",
        description: `Conectado como ${allAccounts[0].meta.name}`,
      });
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast({
        title: "Error",
        description: "No se pudo conectar la wallet",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccounts([]);
    setSelectedAccount(null);
    toast({
      title: "Wallet desconectada",
      description: "Has cerrado sesión exitosamente",
    });
  };

  const signMessage = async (message: string) => {
    if (!selectedAccount) return null;

    try {
      const injector = await web3FromAddress(selectedAccount.address);
      const signRaw = injector?.signer?.signRaw;
      
      if (signRaw) {
        const { signature } = await signRaw({
          address: selectedAccount.address,
          data: message,
          type: 'bytes'
        });
        return signature;
      }
    } catch (error) {
      console.error('Error signing message:', error);
      toast({
        title: "Error",
        description: "No se pudo firmar el mensaje",
        variant: "destructive"
      });
    }
    return null;
  };

  return {
    accounts,
    selectedAccount,
    isConnecting,
    connectWallet,
    disconnectWallet,
    signMessage,
    isConnected: !!selectedAccount,
    api,
    isApiReady
  };
};
