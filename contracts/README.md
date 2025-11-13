# GitArch Smart Contract - Shibuya Testnet

Este directorio contiene el smart contract Ink! para GitArch POAPs en la red Shibuya (Astar testnet).

## 📋 Requisitos Previos

- [Rust](https://www.rust-lang.org/tools/install)
- [cargo-contract](https://github.com/paritytech/cargo-contract)
- [Polkadot.js Browser Extension](https://polkadot.js.org/extension/)
- Tokens de prueba SBY (Shibuya)

## 🛠️ Instalación

### 1. Instalar Rust
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup default stable
rustup update
rustup component add rust-src
```

### 2. Instalar cargo-contract
```bash
cargo install --force --locked cargo-contract
```

### 3. Obtener tokens de prueba
1. Visita [Shibuya Faucet](https://portal.astar.network/shibuya-testnet/assets)
2. Conecta tu wallet Polkadot.js
3. Solicita tokens SBY gratuitos

## 📦 Compilación del Contrato

```bash
cd contracts/poap
cargo contract build --release
```

Esto generará:
- `target/ink/gitarch_poap.contract` - Archivo del contrato
- `target/ink/gitarch_poap.wasm` - Binario WebAssembly
- `target/ink/metadata.json` - Metadata del contrato

## 🚀 Deployment en Shibuya

### Opción 1: Usando Polkadot.js Apps

1. Visita [Polkadot.js Apps - Shibuya](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fshibuya.public.blastapi.io#/contracts)
2. Ve a Developer -> Contracts
3. Haz clic en "Upload & deploy code"
4. Selecciona `gitarch_poap.contract`
5. Configura los parámetros del constructor
6. Deploy el contrato

### Opción 2: Usando cargo-contract CLI

```bash
cargo contract instantiate \
  --constructor new \
  --suri "//Alice" \
  --url wss://shibuya.public.blastapi.io \
  --execute
```

## 🔧 Interacción con el Contrato

### Mintear un POAP

```typescript
import { ApiPromise, WsProvider } from '@polkadot/api';
import { ContractPromise } from '@polkadot/api-contract';

const provider = new WsProvider('wss://shibuya.public.blastapi.io');
const api = await ApiPromise.create({ provider });

const contract = new ContractPromise(
  api,
  metadata, // Import from metadata.json
  contractAddress
);

// Mintear POAP
const tx = await contract.tx.mintPoap(
  { value: 0, gasLimit: -1 },
  projectId,
  recipientAddress,
  metadataUri
);
```

### Consultar POAPs de un usuario

```typescript
const { result, output } = await contract.query.getUserPoaps(
  callerAddress,
  { value: 0, gasLimit: -1 },
  userAddress
);

console.log('User POAPs:', output.toHuman());
```

## 📝 Funciones del Contrato

### Escritura (Transactions)
- `mint_poap(project_id, recipient, metadata_uri)` - Mintea un nuevo POAP
- `publish_project(project_id)` - Registra un nuevo proyecto

### Lectura (Queries)
- `get_user_poaps(user)` - Obtiene todos los POAPs de un usuario
- `get_poap_metadata(token_id)` - Obtiene metadata de un POAP específico
- `get_project_poap(project_id)` - Obtiene el POAP asociado a un proyecto
- `total_poaps()` - Total de POAPs minteados
- `total_projects()` - Total de proyectos registrados

## 🧪 Testing

```bash
cd contracts/poap
cargo test
```

## 📚 Estructura del Proyecto

```
contracts/poap/
├── lib.rs           # Código principal del contrato
├── Cargo.toml       # Dependencias
└── .gitignore       # Archivos ignorados
```

## 🔗 Recursos

- [Astar Network Docs](https://docs.astar.network/)
- [Ink! Documentation](https://use.ink/)
- [Polkadot.js Documentation](https://polkadot.js.org/docs/)
- [Shibuya Testnet Explorer](https://shibuya.subscan.io/)

## 🛡️ Seguridad

Este contrato es para propósitos educativos y de testnet. Para producción:
- Realiza una auditoría de seguridad completa
- Implementa límites de rate limiting
- Agrega control de acceso robusto
- Considera usar upgradeable contracts

## 📄 Licencia

MIT
