import { useEffect, useMemo } from 'react';
import { ApiPromise } from '@polkadot/api';
import { ContractPromise } from '@polkadot/api-contract';
import { web3FromAddress } from '@polkadot/extension-dapp';
import { blake2AsU8a } from '@polkadot/util-crypto';
import { u8aToHex, stringToU8a } from '@polkadot/util';
import { toast } from '@/hooks/use-toast';
import { useWallet } from '@/hooks/useWallet';
import { POAP_CONTRACT_ADDRESS } from '@/config/blockchain';
import { getPoapAbi } from '@/contracts/poapAbi';

export const usePolkadot = () => {
  const { api, isApiReady, selectedAccount } = useWallet();

  const state = {
    api,
    isApiReady,
    selectedAccount,
  } as const;

  const contractAvailablePromise = useMemo(async () => {
    if (!isApiReady || !api || !POAP_CONTRACT_ADDRESS) return null;
    const abi = await getPoapAbi();
    if (!abi) return null;
    try {
      const contract = new ContractPromise(api as ApiPromise, abi, POAP_CONTRACT_ADDRESS);
      return contract;
    } catch (e) {
      console.error('Error creating contract instance:', e);
      return null;
    }
  }, [api, isApiReady]);

  const mintPoap = async (projectId: string, recipient: string, metadataUri: string) => {
    try {
      if (!isApiReady || !api) throw new Error('API no lista');
      if (!selectedAccount) throw new Error('Wallet no conectada');
      if (!POAP_CONTRACT_ADDRESS) throw new Error('Contrato no configurado');
      const abi = await getPoapAbi();
      if (!abi) throw new Error('ABI del contrato no disponible');

      const contract = new ContractPromise(api, abi, POAP_CONTRACT_ADDRESS);
      const injector = await web3FromAddress(selectedAccount.address);

      // Hash a 32 bytes del projectId para mapear a [u8;32]
      const projectHash = blake2AsU8a(stringToU8a(projectId), 256);
      const gasLimit: any = api.registry.createType('WeightV2', {
        refTime: 2_000_000_000,
        proofSize: 1_000_000,
      }) as any;

      const tx = contract.tx['mint_poap']?.({ gasLimit }, projectHash, recipient, metadataUri);
      if (!tx) throw new Error('Método mint_poap no encontrado en el contrato');

      return await new Promise<string>((resolve, reject) => {
        tx.signAndSend(selectedAccount.address, { signer: injector.signer }, (result) => {
          if (result.status.isInBlock) {
            console.log('Incluida en bloque:', result.status.asInBlock.toString());
          }
          if (result.status.isFinalized) {
            const finalized = result.status.asFinalized.toString();
            toast({ title: 'POAP minteado on-chain', description: `Bloque: ${finalized.slice(0, 10)}...` });
            resolve(finalized);
          }
          if (result.isError) {
            reject(new Error('Transacción fallida'));
          }
        }).catch(reject);
      });
    } catch (e: any) {
      console.error('Error mintPoap:', e);
      toast({ title: 'Error al mintear', description: e.message ?? String(e), variant: 'destructive' });
      throw e;
    }
  };

  const getUserPoaps = async (address: string): Promise<bigint[]> => {
    if (!isApiReady || !api || !POAP_CONTRACT_ADDRESS) return [];
    const abi = await getPoapAbi();
    if (!abi) return [];
    const contract = new ContractPromise(api, abi, POAP_CONTRACT_ADDRESS);
    const { result, output } = await contract.query['get_user_poaps']?.(address, { gasLimit: -1 }, address) as any;
    if (!result?.isOk || !output) return [];
    try {
      const vec = output.toJSON() as number[];
      return vec.map((n) => BigInt(n));
    } catch {
      return [];
    }
  };

  const getPoapMetadata = async (tokenId: bigint): Promise<any | null> => {
    if (!isApiReady || !api || !POAP_CONTRACT_ADDRESS) return null;
    const abi = await getPoapAbi();
    if (!abi) return null;
    const contract = new ContractPromise(api, abi, POAP_CONTRACT_ADDRESS);
    const { result, output } = await contract.query['get_poap_metadata']?.(
      selectedAccount?.address ?? POAP_CONTRACT_ADDRESS,
      { gasLimit: -1 },
      tokenId,
    ) as any;
    if (!result?.isOk || !output) return null;
    return output.toJSON();
  };

  return {
    ...state,
    contractAvailablePromise,
    mintPoap,
    getUserPoaps,
    getPoapMetadata,
    contractAddress: POAP_CONTRACT_ADDRESS,
  } as const;
};
