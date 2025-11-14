#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[openbrush::implementation(PSP34, PSP34Metadata)]
#[openbrush::contract]
pub mod gitarch_poap {
    use openbrush::traits::Storage;
    use openbrush::contracts::psp34::*;
    use openbrush::contracts::psp34::extensions::metadata::*;
    use ink::prelude::string::String as PreludeString;
    use ink::prelude::vec::Vec;

    /// Estructura para metadata extendida del POAP
    #[derive(Debug, Clone, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout))]
    pub struct POAPMetadata {
        pub project_id: [u8; 32],
        pub owner: AccountId,
        pub metadata_uri: PreludeString,
        pub timestamp: u64,
    }

    /// Eventos del contrato
    #[ink(event)]
    pub struct POAPMinted {
        #[ink(topic)]
        token_id: Id,
        #[ink(topic)]
        owner: AccountId,
        project_id: [u8; 32],
        metadata_uri: PreludeString,
    }

    #[ink(event)]
    pub struct ProjectPublished {
        #[ink(topic)]
        project_id: [u8; 32],
        #[ink(topic)]
        author: AccountId,
    }

    #[ink(storage)]
    #[derive(Default, Storage)]
    pub struct GitArchPOAP {
        #[storage_field]
        psp34: psp34::Data,
        #[storage_field]
        metadata: metadata::Data,
        /// Contador de POAPs (token IDs)
        poap_counter: u64,
        /// Contador de proyectos
        project_count: u64,
        /// Mapping de token_id a metadata extendida
        poap_metadata: ink::storage::Mapping<Id, POAPMetadata>,
        /// Mapping de usuario a sus POAPs
        user_poaps: ink::storage::Mapping<AccountId, Vec<Id>>,
        /// Mapping de proyecto a POAP
        project_poap: ink::storage::Mapping<[u8; 32], Id>,
        /// Owner del contrato
        owner: AccountId,
    }

    /// Error personalizado
    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum Error {
        POAPAlreadyExists,
        Unauthorized,
        PSP34Error(PSP34Error),
    }

    impl From<PSP34Error> for Error {
        fn from(error: PSP34Error) -> Self {
            Error::PSP34Error(error)
        }
    }

    impl GitArchPOAP {
        #[ink(constructor)]
        pub fn new() -> Self {
            let mut instance = Self::default();
            instance.owner = Self::env().caller();
            instance.poap_counter = 0;
            instance.project_count = 0;
            instance
        }

        /// Mintea un POAP para un proyecto (compatible PSP34)
        #[ink(message)]
        pub fn mint_poap(
            &mut self,
            project_id: [u8; 32],
            recipient: AccountId,
            metadata_uri: PreludeString,
        ) -> Result<Id, Error> {
            // Verificar que no exista POAP para este proyecto
            if self.project_poap.contains(project_id) {
                return Err(Error::POAPAlreadyExists);
            }

            let token_id = Id::U64(self.poap_counter);
            self.poap_counter += 1;

            // Mintear usando PSP34 (esto hace que el wallet lo reconozca)
            self._mint_to(recipient, token_id.clone())?;

            // Guardar metadata extendida
            let metadata = POAPMetadata {
                project_id,
                owner: recipient,
                metadata_uri: metadata_uri.clone(),
                timestamp: self.env().block_timestamp(),
            };

            self.poap_metadata.insert(token_id.clone(), &metadata);
            self.project_poap.insert(project_id, &token_id);

            // Agregar a POAPs del usuario
            let mut user_tokens = self.user_poaps.get(recipient).unwrap_or_default();
            user_tokens.push(token_id.clone());
            self.user_poaps.insert(recipient, &user_tokens);

            // Emitir evento personalizado
            self.env().emit_event(POAPMinted {
                token_id: token_id.clone(),
                owner: recipient,
                project_id,
                metadata_uri,
            });

            Ok(token_id)
        }

        /// Obtiene los POAPs de un usuario
        #[ink(message)]
        pub fn get_user_poaps(&self, user: AccountId) -> Vec<Id> {
            self.user_poaps.get(user).unwrap_or_default()
        }

        /// Obtiene metadata extendida de un POAP
        #[ink(message)]
        pub fn get_poap_metadata(&self, token_id: Id) -> Option<POAPMetadata> {
            self.poap_metadata.get(token_id)
        }

        /// Obtiene el POAP de un proyecto
        #[ink(message)]
        pub fn get_project_poap(&self, project_id: [u8; 32]) -> Option<Id> {
            self.project_poap.get(project_id)
        }

        /// Publica un proyecto en el contrato
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

        /// Total de POAPs minteados
        #[ink(message)]
        pub fn total_poaps(&self) -> u64 {
            self.poap_counter
        }

        /// Total de proyectos registrados
        #[ink(message)]
        pub fn total_projects(&self) -> u64 {
            self.project_count
        }
    }

    #[cfg(test)]
    mod tests {
        use super::*;

        #[ink::test]
        fn test_mint_poap() {
            let mut contract = GitArchPOAP::new();
            let accounts = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();
            let project_id = [1u8; 32];
            
            let result = contract.mint_poap(
                project_id,
                accounts.alice,
                PreludeString::from("ipfs://test"),
            );

            assert!(result.is_ok());
            assert_eq!(contract.total_poaps(), 1);
        }
    }
}
