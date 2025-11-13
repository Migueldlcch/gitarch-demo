#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod gitarch_poap {
    use ink::storage::Mapping;

    /// Estructura para metadata del POAP
    #[derive(Debug, Clone, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub struct POAPMetadata {
        pub project_id: [u8; 32],
        pub owner: AccountId,
        pub metadata_uri: ink::prelude::string::String,
        pub timestamp: u64,
    }

    /// Eventos del contrato
    #[ink(event)]
    pub struct POAPMinted {
        #[ink(topic)]
        token_id: u64,
        #[ink(topic)]
        owner: AccountId,
        project_id: [u8; 32],
        metadata_uri: ink::prelude::string::String,
    }

    #[ink(event)]
    pub struct ProjectPublished {
        #[ink(topic)]
        project_id: [u8; 32],
        #[ink(topic)]
        author: AccountId,
    }

    #[ink(storage)]
    pub struct GitArchPOAP {
        /// Contador de POAPs
        poap_counter: u64,
        /// Contador de proyectos
        project_count: u64,
        /// Mapping de token_id a metadata
        poap_metadata: Mapping<u64, POAPMetadata>,
        /// Mapping de usuario a sus POAPs
        user_poaps: Mapping<AccountId, ink::prelude::vec::Vec<u64>>,
        /// Mapping de proyecto a POAP
        project_poap: Mapping<[u8; 32], u64>,
        /// Owner del contrato
        owner: AccountId,
    }

    impl GitArchPOAP {
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                poap_counter: 0,
                project_count: 0,
                poap_metadata: Mapping::default(),
                user_poaps: Mapping::default(),
                project_poap: Mapping::default(),
                owner: Self::env().caller(),
            }
        }

        /// Mintea un POAP para un proyecto
        #[ink(message)]
        pub fn mint_poap(
            &mut self,
            project_id: [u8; 32],
            recipient: AccountId,
            metadata_uri: ink::prelude::string::String,
        ) -> Result<u64, Error> {
            let caller = self.env().caller();
            
            // Verificar que no exista POAP para este proyecto y usuario
            if self.project_poap.contains(project_id) {
                return Err(Error::POAPAlreadyExists);
            }

            let token_id = self.poap_counter;
            self.poap_counter += 1;

            let metadata = POAPMetadata {
                project_id,
                owner: recipient,
                metadata_uri: metadata_uri.clone(),
                timestamp: self.env().block_timestamp(),
            };

            // Guardar metadata
            self.poap_metadata.insert(token_id, &metadata);
            self.project_poap.insert(project_id, &token_id);

            // Agregar a POAPs del usuario
            let mut user_tokens = self.user_poaps.get(recipient).unwrap_or_default();
            user_tokens.push(token_id);
            self.user_poaps.insert(recipient, &user_tokens);

            // Emitir evento
            self.env().emit_event(POAPMinted {
                token_id,
                owner: recipient,
                project_id,
                metadata_uri,
            });

            Ok(token_id)
        }

        /// Obtiene los POAPs de un usuario
        #[ink(message)]
        pub fn get_user_poaps(&self, user: AccountId) -> ink::prelude::vec::Vec<u64> {
            self.user_poaps.get(user).unwrap_or_default()
        }

        /// Obtiene metadata de un POAP
        #[ink(message)]
        pub fn get_poap_metadata(&self, token_id: u64) -> Option<POAPMetadata> {
            self.poap_metadata.get(token_id)
        }

        /// Obtiene el POAP de un proyecto
        #[ink(message)]
        pub fn get_project_poap(&self, project_id: [u8; 32]) -> Option<u64> {
            self.project_poap.get(project_id)
        }

        /// Registra un nuevo proyecto
        #[ink(message)]
        pub fn publish_project(&mut self, project_id: [u8; 32]) -> Result<(), Error> {
            let caller = self.env().caller();
            self.project_count += 1;

            self.env().emit_event(ProjectPublished {
                project_id,
                author: caller,
            });

            Ok(())
        }

        /// Obtiene el total de POAPs minteados
        #[ink(message)]
        pub fn total_poaps(&self) -> u64 {
            self.poap_counter
        }

        /// Obtiene el total de proyectos
        #[ink(message)]
        pub fn total_projects(&self) -> u64 {
            self.project_count
        }
    }

    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum Error {
        POAPAlreadyExists,
        Unauthorized,
    }

    #[cfg(test)]
    mod tests {
        use super::*;

        #[ink::test]
        fn mint_poap_works() {
            let mut contract = GitArchPOAP::new();
            let project_id = [0u8; 32];
            let accounts = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();
            
            let result = contract.mint_poap(
                project_id,
                accounts.alice,
                "ipfs://metadata".into(),
            );
            
            assert!(result.is_ok());
            assert_eq!(contract.total_poaps(), 1);
        }

        #[ink::test]
        fn get_user_poaps_works() {
            let mut contract = GitArchPOAP::new();
            let project_id = [0u8; 32];
            let accounts = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();
            
            contract.mint_poap(project_id, accounts.alice, "ipfs://metadata".into()).unwrap();
            
            let poaps = contract.get_user_poaps(accounts.alice);
            assert_eq!(poaps.len(), 1);
        }
    }
}
