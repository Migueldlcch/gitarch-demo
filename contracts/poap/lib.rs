#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod gitarch_poap {
    #[ink(storage)]
    pub struct GitArchPOAP {
        value: bool,
        owner: AccountId,
        total_poaps: u64,
    }

    impl GitArchPOAP {
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                value: false,
                owner: Self::env().caller(),
                total_poaps: 0,
            }
        }

        #[ink(message)]
        pub fn get_value(&self) -> bool {
            self.value
        }

        #[ink(message)]
        pub fn flip(&mut self) {
            self.value = !self.value;
        }

        #[ink(message)]
        pub fn get_owner(&self) -> AccountId {
            self.owner
        }

        #[ink(message)]
        pub fn get_total_poaps(&self) -> u64 {
            self.total_poaps
        }

        #[ink(message)]
        pub fn mint_dummy_poap(&mut self) {
            self.total_poaps += 1;
        }
    }

    #[cfg(test)]
    mod tests {
        use super::*;

        #[ink::test]
        fn new_works() {
            let contract = GitArchPOAP::new();
            assert_eq!(contract.get_value(), false);
            assert_eq!(contract.get_total_poaps(), 0);
        }

        #[ink::test]
        fn flip_works() {
            let mut contract = GitArchPOAP::new();
            assert_eq!(contract.get_value(), false);
            contract.flip();
            assert_eq!(contract.get_value(), true);
        }

        #[ink::test]
        fn mint_works() {
            let mut contract = GitArchPOAP::new();
            assert_eq!(contract.get_total_poaps(), 0);
            contract.mint_dummy_poap();
            assert_eq!(contract.get_total_poaps(), 1);
        }

        #[ink::test]
        fn owner_works() {
            let contract = GitArchPOAP::new();
            let accounts = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();
            // En tests, el caller por defecto es accounts.alice
            assert_eq!(contract.get_owner(), accounts.alice);
        }
    }
}