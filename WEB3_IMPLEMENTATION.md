# 🚀 Guía de Implementación Web3 - GitArch

## ✅ CAMBIOS IMPLEMENTADOS

### 1️⃣ **Smart Contract PSP34 (GRATIS)** ✨
**¿Qué cambió?**
- ✅ Migrado de contrato básico a **PSP34** (estándar NFT de Polkadot)
- ✅ Ahora los wallets (Talisman, Polkadot.js) **reconocerán automáticamente** tus POAPs
- ✅ Compatible con mercados NFT de Polkadot

**¿Por qué PSP34?**
```
PSP34 = ERC721 (de Ethereum) pero para Polkadot
- Función mint() estándar
- Función ownerOf() para verificar propiedad
- Eventos Transfer estándar
- Metadata URI compatible con wallets
```

**Archivo:** `contracts/poap/lib.rs`
**Dependencias:** Agregado `openbrush` (biblioteca oficial de Polkadot)

**¿Qué hacer ahora?**
```bash
# 1. Compilar el contrato PSP34
cd contracts/poap
cargo contract build --release

# 2. Deployar en Shibuya
# Opción A: UI de Polkadot.js
# Ir a: https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fshibuya.polkadot.io#/contracts
# Upload > Seleccionar target/ink/gitarch_poap.contract > Deploy

# Opción B: CLI
cargo contract instantiate \
  --constructor new \
  --suri "//TuSeedPhrase" \
  --url wss://shibuya.polkadot.io \
  --execute

# 3. Copiar la CONTRACT_ADDRESS que te da
# 4. Agregar a .env:
VITE_POAP_CONTRACT_ADDRESS=ZX7abc...xyz123
```

---

### 2️⃣ **IPFS con Pinata (GRATIS hasta 1GB)** 📦

**¿Qué es IPFS?**
Sistema descentralizado de archivos. La metadata del NFT vive aquí para siempre.

**Archivo:** `src/services/ipfs.ts`

**Servicios IPFS gratuitos:**
1. **Pinata** (recomendado): 1GB gratis
   - Signup: https://pinata.cloud
   - Dashboard > API Keys > Create JWT
   
2. **NFT.Storage**: 100% gratis, ilimitado
   - Signup: https://nft.storage
   - API Key gratis

**Configuración:**
```bash
# Agregar a .env
VITE_PINATA_JWT=eyJhbGc...  # Tu JWT de Pinata
```

**Funciones disponibles:**
```typescript
import { uploadImageToIPFS, uploadMetadataToIPFS } from '@/services/ipfs';

// Subir imagen del proyecto
const imageUri = await uploadImageToIPFS(file); 
// Retorna: "ipfs://QmXyz..."

// Subir metadata JSON
const metadataUri = await uploadMetadataToIPFS({
  name: "POAP - Mi Proyecto",
  image: imageUri,
  ...
});
```

**Sin IPFS configurado:** Funciona igual pero usa data URIs temporales (solo para testnet).

---

### 3️⃣ **Indicador de Red Shibuya** 🌐

**¿Qué hace?**
Muestra en tiempo real:
- ✅ Estado de conexión a Shibuya Testnet
- ✅ Altura de bloque actual (actualizado cada ~12 segundos)
- ✅ Cuenta activa conectada

**Archivos:**
- `src/components/NetworkIndicator.tsx` (nuevo componente)
- `src/components/Navbar.tsx` (actualizado con indicador)

**Vista:**
```
[🟢 Shibuya] [#1,234,567] [Wallet: 5Dxyz...abc]
     ↑            ↑              ↑
  Conectado   Bloque      Cuenta activa
```

---

### 4️⃣ **Edge Function Mejorada** ⚡

**¿Qué cambió?**
- ✅ Logs detallados con emojis (🚀✅❌📦)
- ✅ Manejo robusto de errores
- ✅ Preparado para IPFS real (código comentado listo para usar)
- ✅ Preparado para contrato real (código comentado listo para usar)
- ✅ Guarda `transaction_hash` y `token_id` correctos

**Archivo:** `supabase/functions/mint-poap/index.ts`

**Flujo actual (simulado):**
```
1. Usuario sube proyecto
2. UploadProject.tsx llama a edge function
3. Edge function:
   - Crea metadata JSON
   - Simula subida a IPFS (data URI)
   - Simula transacción en Shibuya (genera txHash)
   - Guarda POAP en Supabase
4. POAP visible en Profile
```

**Flujo futuro (producción):**
```
1. Usuario sube proyecto
2. UploadProject.tsx llama a edge function
3. Edge function:
   - Sube imagen a Pinata IPFS ✅
   - Sube metadata a Pinata IPFS ✅
   - Llama al contrato PSP34 en Shibuya ⛓️
   - Escucha evento POAPMinted 👂
   - Guarda txHash y tokenId reales
4. POAP visible en wallet del usuario 🎉
```

---

## 📋 PRÓXIMOS PASOS (ordenados por prioridad)

### 🔴 **CRÍTICO - Necesitas hacer:**

#### 1. Deployar contrato PSP34 en Shibuya
```bash
cd contracts/poap
cargo contract build --release
# Luego deploy via UI o CLI
```
**Costo:** GRATIS (solo necesitas SBY tokens de testnet)
**Tiempo:** 5-10 minutos
**Faucet:** https://portal.astar.network/shibuya-testnet/assets

#### 2. Crear cuenta Pinata
- Ir a https://pinata.cloud
- Sign up (gratis)
- Dashboard > API Keys > Create JWT
- Agregar `VITE_PINATA_JWT` a `.env`

**Costo:** GRATIS (1GB de storage)
**Tiempo:** 2 minutos

---

### 🟡 **IMPORTANTE - Para producción:**

#### 3. Conectar edge function con contrato real
En `supabase/functions/mint-poap/index.ts`, descomentar las líneas 126-141:
```typescript
// Esto está comentado actualmente
import { ApiPromise, WsProvider } from '@polkadot/api';
const provider = new WsProvider('wss://shibuya.polkadot.io');
// ... resto del código
```

**Desafío:** Edge functions de Deno no soportan nativamente Polkadot.js
**Solución:** Mintear desde el frontend con `usePolkadot` hook (ya implementado)

#### 4. Actualizar `usePolkadot.ts` para usar IPFS real
En `src/hooks/usePolkadot.ts` línea 46-52, integrar con servicio IPFS:
```typescript
// Antes de llamar mintPoap, subir a IPFS
const imageUri = await uploadImageToIPFS(projectImage);
const metadataUri = await uploadMetadataToIPFS(...);
await mintPoap(projectId, recipient, metadataUri);
```

---

### 🟢 **OPCIONAL - Mejoras futuras:**

5. **Sistema de notificaciones**: Toast cuando se mintea POAP
6. **Galería de POAPs**: Vista grid con todos los POAPs del usuario
7. **Compartir en redes**: "Acabo de ganar mi POAP en GitArch"
8. **Verificación en blockchain**: Botón "Verificar en Subscan"

---

## 💰 COSTOS TOTALES

| Componente | Costo |
|------------|-------|
| Smart Contract (deploy) | **GRATIS** (testnet) |
| IPFS (Pinata) | **GRATIS** (1GB) |
| Supabase | **GRATIS** (tier actual) |
| Shibuya testnet | **GRATIS** (faucet) |
| **TOTAL** | **$0 USD** ✅ |

**Para mainnet (producción):**
- Deploy en Astar: ~$5-10 USD en ASTR
- IPFS: $0-20/mes (según uso)
- Supabase: $0-25/mes (según uso)

---

## 🎓 CONCEPTOS WEB3 EXPLICADOS

### PSP34 vs ERC721
```
ERC721 (Ethereum)     PSP34 (Polkadot)
------------------    ------------------
mint()                mint_poap()
ownerOf()             owner_of()
Transfer event        Transfer event
metadata URI          metadata URI
Solidity              Ink! (Rust)
$50-100 gas fees      $0.01 fees
```

### ¿Por qué necesitas IPFS?
```
❌ Almacenar imagen on-chain = $10,000+ (muy caro)
✅ Almacenar hash IPFS on-chain = $0.01 (barato)

La imagen vive en IPFS → descentralizada, inmutable
El contrato guarda: "ipfs://QmXyz..." → hash del archivo
```

### Flow completo de minteo:
```
1. Usuario sube proyecto
   ↓
2. Imagen → IPFS → ipfs://QmImage123
   ↓
3. Metadata → IPFS → ipfs://QmMeta456
   ↓
4. Contrato.mint_poap(user, ipfs://QmMeta456)
   ↓
5. Evento POAPMinted(tokenId: 42)
   ↓
6. Wallet detecta Transfer event → muestra NFT
```

---

## 🐛 TROUBLESHOOTING

### "API no lista" error
```typescript
// Verificar en useWallet.tsx
if (!isApiReady) {
  console.log('Esperando conexión a Shibuya...');
}
```
**Solución:** Esperar 2-3 segundos después de cargar la página.

### "Contrato no configurado"
```bash
# Verificar .env
echo $VITE_POAP_CONTRACT_ADDRESS
# Debe mostrar: 5Xyz...abc (tu contrato)
```

### POAPs no aparecen en wallet
1. ✅ Verificar que usas PSP34 (nuevo contrato)
2. ✅ Verificar metadata URI válido
3. ✅ Esperar 1-2 bloques (~24 segundos)
4. ✅ Refrescar wallet

---

## 📚 RECURSOS

- [Ink! Docs](https://use.ink/) - Smart contracts en Rust
- [OpenBrush](https://openbrush.io/) - Estándares PSP34
- [Astar Docs](https://docs.astar.network/) - Shibuya testnet
- [Pinata](https://docs.pinata.cloud/) - IPFS API
- [Polkadot.js](https://polkadot.js.org/docs/) - Frontend integration

---

**¿Preguntas? Escríbeme en el chat y te explico lo que necesites! 🚀**
