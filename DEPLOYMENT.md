# 🚀 GitArch - Guía de Deployment Completa

## 📋 Índice
1. [Arquitectura del Sistema](#arquitectura)
2. [Configuración Inicial](#configuración-inicial)
3. [Deployment del Smart Contract](#deployment-smart-contract)
4. [Configuración de Backend](#configuración-backend)
5. [Integración Frontend](#integración-frontend)
6. [Testing](#testing)
7. [Troubleshooting](#troubleshooting)

---

## 🏗️ Arquitectura

```
GitArch
├── Frontend (React + TypeScript)
│   ├── Polkadot.js Integration
│   └── Supabase Client
├── Backend (Supabase)
│   ├── Database (PostgreSQL)
│   ├── Storage (Project Images)
│   └── Edge Functions (mint-poap)
└── Blockchain (Shibuya Testnet)
    └── Smart Contract (Ink!)
```

---

## ⚙️ Configuración Inicial

### 1. Variables de Entorno

El archivo `.env` ya está configurado con:
```env
VITE_SUPABASE_PROJECT_ID=upgxadknveflibgpruaw
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_URL=https://upgxadknveflibgpruaw.supabase.co
```

### 2. Instalar Dependencias

```bash
npm install
# o
bun install
```

### 3. Configurar Polkadot.js Extension

1. Instala [Polkadot.js Extension](https://polkadot.js.org/extension/)
2. Crea una cuenta o importa una existente
3. Configura la red a Shibuya Testnet

---

## 🔗 Deployment del Smart Contract

### Paso 1: Instalar Herramientas

```bash
# Instalar Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# Instalar cargo-contract
cargo install --force --locked cargo-contract

# Verificar instalación
cargo contract --version
```

### Paso 2: Compilar el Contrato

```bash
cd contracts/poap
cargo contract build --release
```

**Output esperado:**
```
✔ Building contract [optimized]
✔ Generating metadata
✔ Contract built: target/ink/gitarch_poap.contract
```

### Paso 3: Obtener Tokens de Prueba

1. Ve a [Shibuya Portal](https://portal.astar.network/shibuya-testnet/assets)
2. Conecta tu wallet
3. Solicita tokens SBY del faucet

### Paso 4: Deploy en Shibuya

#### Opción A: UI de Polkadot.js

1. Abre [Polkadot.js Apps - Shibuya](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fshibuya.public.blastapi.io#/contracts)
2. Developer → Contracts → Upload & Deploy
3. Selecciona `target/ink/gitarch_poap.contract`
4. Constructor: `new()`
5. Click "Deploy"
6. **Guarda la dirección del contrato desplegado**

#### Opción B: Línea de Comandos

```bash
cargo contract instantiate \
  --constructor new \
  --suri "//TuSeedPhrase" \
  --url wss://shibuya.public.blastapi.io \
  --execute
```

### Paso 5: Actualizar Dirección del Contrato

Una vez desplegado, actualiza en `supabase/functions/mint-poap/index.ts`:

```typescript
const contractAddress = 'TU_DIRECCION_DE_CONTRATO_AQUI';
```

---

## 🗄️ Configuración de Backend

### Base de Datos

Las tablas ya están creadas vía migraciones:
- ✅ `profiles` - Perfiles de usuario
- ✅ `projects` - Proyectos arquitectónicos
- ✅ `poaps` - POAPs NFT

### Storage

Bucket `project-images` configurado como público.

### Edge Functions

La función `mint-poap` se despliega automáticamente. Verificar logs:

```bash
# Ver logs de edge function
supabase functions logs mint-poap
```

---

## 🎨 Integración Frontend

### Conexión a Shibuya

El hook `useWallet` ya está configurado:

```typescript
const SHIBUYA_WSS = 'wss://shibuya.public.blastapi.io';
```

### Flujo de Usuario

1. **Conectar Wallet** → `WalletConnect` component
2. **Subir Proyecto** → Auto-mintea POAP
3. **Ver Perfil** → Muestra POAPs ganados
4. **Explorar** → Ver proyectos y generar POAPs

---

## 🧪 Testing

### 1. Test Local del Frontend

```bash
npm run dev
```

Visita `http://localhost:5173`

### 2. Test de Conexión Blockchain

```typescript
// En la consola del navegador
const api = await window.polkadot.api;
const chainInfo = await api.rpc.system.chain();
console.log('Connected to:', chainInfo.toString());
// Debe mostrar: "Shibuya Testnet"
```

### 3. Test del Flujo Completo

1. **Registrarse**
   - Ve a `/auth`
   - Crea cuenta con email/password
   - Conecta wallet Polkadot (opcional)

2. **Subir Proyecto**
   - Ve a `/upload`
   - Completa el formulario
   - Sube imágenes
   - Verifica que se mintee POAP automáticamente

3. **Verificar POAP**
   - Ve a tu perfil
   - Tab "POAPs"
   - Verifica que aparezca el POAP recién minteado

4. **Explorar y Mintear**
   - Ve a `/explore`
   - Selecciona un proyecto
   - Genera tu POAP
   - Verifica en perfil

---

## 🐛 Troubleshooting

### Error: "No se pudo conectar la wallet"

**Causa:** Extension no instalada o cuenta no creada

**Solución:**
1. Instala Polkadot.js Extension
2. Crea/importa cuenta
3. Autoriza el sitio web

### Error: "Transaction failed"

**Causa:** Falta de fondos en testnet

**Solución:**
1. Visita [Shibuya Faucet](https://portal.astar.network/shibuya-testnet/assets)
2. Solicita tokens SBY
3. Espera confirmación

### Error: "Contract not found"

**Causa:** Dirección de contrato incorrecta

**Solución:**
1. Verifica la dirección en Polkadot.js Apps
2. Actualiza en `mint-poap/index.ts`
3. Redeploy edge function

### POAPs no aparecen en el perfil

**Causa:** RLS policies o query incorrecta

**Solución:**
1. Verifica que el usuario esté autenticado
2. Revisa console logs del navegador
3. Verifica en Supabase que el POAP se haya creado

### Error de compilación del contrato

**Causa:** Versiones de dependencias

**Solución:**
```bash
rustup update
cargo clean
cargo contract build --release
```

---

## 📊 Monitoring

### Verificar Transacciones

[Shibuya Subscan](https://shibuya.subscan.io/)

### Ver Logs de Edge Functions

```bash
supabase functions logs mint-poap --project-ref upgxadknveflibgpruaw
```

### Database Queries

Verificar POAPs creados:
```sql
SELECT 
  p.username,
  po.token_id,
  po.created_at,
  pr.title
FROM poaps po
JOIN profiles p ON p.id = po.user_id
JOIN projects pr ON pr.id = po.project_id
ORDER BY po.created_at DESC
LIMIT 10;
```

---

## 🎯 Próximos Pasos

- [ ] Deploy contrato en Shibuya
- [ ] Actualizar dirección en edge function
- [ ] Implementar subida de metadata a IPFS
- [ ] Agregar sistema de notificaciones
- [ ] Implementar búsqueda avanzada
- [ ] Migrar a Astar Mainnet (producción)

---

## 🔐 Seguridad

**Para Testnet (Actual):**
- ✅ RLS policies habilitadas
- ✅ Validación de input
- ✅ Autenticación requerida

**Para Producción:**
- [ ] Auditoría de smart contract
- [ ] Rate limiting en edge functions
- [ ] Backup automático de base de datos
- [ ] Monitoring y alertas
- [ ] CDN para imágenes

---

## 📞 Soporte

- [Astar Discord](https://discord.gg/astarnetwork)
- [Polkadot Stack Exchange](https://substrate.stackexchange.com/)
- [Supabase Docs](https://supabase.com/docs)

---

**¡Listo para producción en Shibuya Testnet! 🎉**
