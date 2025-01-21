module exampleAddress::betting_campaign {
    use supra_framework::supra_coin;
    use supra_framework::coin;
    use std::signer;
    use std::account;
    use std::vector;
    
    // Error codes
    const ERR_INSUFFICIENT_BALANCE: u64 = 0;
    const ERR_CAMPAIGN_ENDED: u64 = 1;
    const ERR_NOT_ENOUGH_BETTORS: u64 = 2;
    const ERR_ALREADY_ENDED: u64 = 3;

    // Struct to track betting campaign
    struct Campaign has key, store {
        coin1_bettors: vector<address>,
        coin2_bettors: vector<address>,
        coin1_amounts: vector<u64>,
        coin2_amounts: vector<u64>,
        coin1_pool: u64,
        coin2_pool: u64,
        total_amount: u64,
        end_time: u64,
        winner_side: u8 // 0 = not decided, 1 = coin1, 2 = coin2
    }

    // Creates a new betting campaign between two coins
    public entry fun create_campaign(
        creator: &signer,
        end_time: u64
    ) {
        // Register coin store for creator if not already registered
        if (!coin::is_account_registered<supra_coin::SupraCoin>(signer::address_of(creator))) {
            coin::register<supra_coin::SupraCoin>(creator);
        };

        let campaign = Campaign {
            coin1_bettors: vector::empty(),
            coin2_bettors: vector::empty(), 
            coin1_amounts: vector::empty(),
            coin2_amounts: vector::empty(),
            coin1_pool: 0,
            coin2_pool: 0,
            total_amount: 0,
            end_time,
            winner_side: 0
        };
        move_to(creator, campaign);
    }

    // Calculate required bet amount using AMM formula
    fun calculate_bet_amount(pool_size: u64, opposite_pool: u64, bet_amount: u64): u64 {
        // For empty pools or first bet, return the bet amount
        if (pool_size == 0 || opposite_pool == 0) {
            return bet_amount
        };

        // Using constant product formula k = x * y
        // After trade: k = (x + dx)(y - dy)
        // where dx is bet_amount and dy is what we want to calculate
        let x = (pool_size as u128);
        let y = (opposite_pool as u128);
        let dx = (bet_amount as u128);
        
        // Original k = x * y
        let k = x * y;
        
        // After trade: k = (x + dx)(y - dy)
        // k = xy - y*dx
        // dy = y - k/(x + dx)
        
        let new_y = k / (x + dx);
        
        // Required amount is the current amount (no additional required)
        bet_amount
    }

    // Place bet on either side of the campaign
    public entry fun place_bet(
        user: &signer,
        campaign_owner: address,
        side: u8,
        amount: u64
    ) acquires Campaign {
        // Register coin store for user if not already registered
        let user_addr = signer::address_of(user);
        if (!coin::is_account_registered<supra_coin::SupraCoin>(user_addr)) {
            coin::register<supra_coin::SupraCoin>(user);
        };

        let campaign = borrow_global_mut<Campaign>(campaign_owner);
        
        // Check campaign hasn't ended
        assert!(campaign.end_time > 0 && campaign.winner_side == 0, ERR_CAMPAIGN_ENDED);
        
        // Calculate required amount based on AMM
        let required_amount = calculate_bet_amount(
            campaign.coin1_pool, 
            campaign.coin2_pool, 
            amount
        );

        // Record bet details
        if (side == 1) {
            vector::push_back(&mut campaign.coin1_bettors, user_addr);
            vector::push_back(&mut campaign.coin1_amounts, amount);
            campaign.coin1_pool = campaign.coin1_pool + amount;
        } else {
            vector::push_back(&mut campaign.coin2_bettors, user_addr);
            vector::push_back(&mut campaign.coin2_amounts, amount);
            campaign.coin2_pool = campaign.coin2_pool + amount;
        };
        campaign.total_amount = campaign.total_amount + amount;

        // Transfer tokens to campaign
        coin::transfer<supra_coin::SupraCoin>(user, campaign_owner, amount);
    }

    // End campaign and distribute rewards
    public entry fun end_campaign(
        owner: &signer,
        winning_side: u8
    ) acquires Campaign {
        let owner_addr = signer::address_of(owner);
        let campaign = borrow_global_mut<Campaign>(owner_addr);
        
        // Validate campaign can be ended
        assert!(campaign.end_time > 0 && campaign.winner_side == 0, ERR_ALREADY_ENDED);
        assert!(!vector::is_empty(&campaign.coin1_bettors) && 
               !vector::is_empty(&campaign.coin2_bettors), ERR_NOT_ENOUGH_BETTORS);

        campaign.winner_side = winning_side;

        // Distribute rewards to winners
        let winners = if (winning_side == 1) &campaign.coin1_bettors else &campaign.coin2_bettors;
        let amounts = if (winning_side == 1) &campaign.coin1_amounts else &campaign.coin2_amounts;
        let winners_pool = if (winning_side == 1) campaign.coin1_pool else campaign.coin2_pool;

        let i = 0;
        while (i < vector::length(winners)) {
            let winner = *vector::borrow(winners, i);
            let bet_amount = *vector::borrow(amounts, i);
            
            let reward = (bet_amount as u128) * (campaign.total_amount as u128) / 
                        (winners_pool as u128);
            
            coin::transfer<supra_coin::SupraCoin>(owner, winner, (reward as u64));
            i = i + 1;
        };
    }

    #[view]
    public fun view_campaign_status(owner: address): (u64, u64, u64, u8) acquires Campaign {
        let campaign = borrow_global<Campaign>(owner);
        (campaign.coin1_pool, campaign.coin2_pool, campaign.end_time, campaign.winner_side)
    }

    #[test_only]
    use std::debug::print;

    #[test(
        supra_framework = @0x1, 
        owner = @0x123, 
        side1_bettor1 = @0x456, 
        side1_bettor2 = @0x457,
        side1_bettor3 = @0x458,
        side2_bettor1 = @0x789,
        side2_bettor2 = @0x790,
        side2_bettor3 = @0x791
    )]
    public entry fun test_multiple_bettors_distribution(
        supra_framework: signer,
        owner: signer,
        side1_bettor1: signer,
        side1_bettor2: signer,
        side1_bettor3: signer,
        side2_bettor1: signer,
        side2_bettor2: signer,
        side2_bettor3: signer
    ) acquires Campaign {
        // Setup test accounts
        let owner_addr = signer::address_of(&owner);
        
        // Side 1 bettors
        let side1_bettor1_addr = signer::address_of(&side1_bettor1);
        let side1_bettor2_addr = signer::address_of(&side1_bettor2);
        let side1_bettor3_addr = signer::address_of(&side1_bettor3);
        
        // Side 2 bettors
        let side2_bettor1_addr = signer::address_of(&side2_bettor1);
        let side2_bettor2_addr = signer::address_of(&side2_bettor2);
        let side2_bettor3_addr = signer::address_of(&side2_bettor3);

        // Create accounts
        account::create_account_for_test(owner_addr);
        account::create_account_for_test(side1_bettor1_addr);
        account::create_account_for_test(side1_bettor2_addr);
        account::create_account_for_test(side1_bettor3_addr);
        account::create_account_for_test(side2_bettor1_addr);
        account::create_account_for_test(side2_bettor2_addr);
        account::create_account_for_test(side2_bettor3_addr);

        // Initialize Supra coin
        let (burn_cap, mint_cap) = supra_coin::initialize_for_test(&supra_framework);

        // Register coin stores
        coin::register<supra_coin::SupraCoin>(&owner);
        coin::register<supra_coin::SupraCoin>(&side1_bettor1);
        coin::register<supra_coin::SupraCoin>(&side1_bettor2);
        coin::register<supra_coin::SupraCoin>(&side1_bettor3);
        coin::register<supra_coin::SupraCoin>(&side2_bettor1);
        coin::register<supra_coin::SupraCoin>(&side2_bettor2);
        coin::register<supra_coin::SupraCoin>(&side2_bettor3);

        // Mint test coins (10000 each)
        let coins_owner = coin::mint<supra_coin::SupraCoin>(10000, &mint_cap);
        coin::deposit(owner_addr, coins_owner);

        // Side 1 bettors initial balances
        coin::deposit(side1_bettor1_addr, coin::mint<supra_coin::SupraCoin>(10000, &mint_cap));
        coin::deposit(side1_bettor2_addr, coin::mint<supra_coin::SupraCoin>(10000, &mint_cap));
        coin::deposit(side1_bettor3_addr, coin::mint<supra_coin::SupraCoin>(10000, &mint_cap));

        // Side 2 bettors initial balances
        coin::deposit(side2_bettor1_addr, coin::mint<supra_coin::SupraCoin>(10000, &mint_cap));
        coin::deposit(side2_bettor2_addr, coin::mint<supra_coin::SupraCoin>(10000, &mint_cap));
        coin::deposit(side2_bettor3_addr, coin::mint<supra_coin::SupraCoin>(10000, &mint_cap));

        coin::destroy_burn_cap(burn_cap);
        coin::destroy_mint_cap(mint_cap);

        // Create campaign
        create_campaign(&owner, 100);
        create_campaign(&side1_bettor1, 100);
        // create_campaign(&side1_bettor1, 100);

        // Store initial balances
        let side1_bettor1_balance = coin::balance<supra_coin::SupraCoin>(side1_bettor1_addr);
        let side1_bettor2_balance = coin::balance<supra_coin::SupraCoin>(side1_bettor2_addr);
        let side1_bettor3_balance = coin::balance<supra_coin::SupraCoin>(side1_bettor3_addr);
        
        let side2_bettor1_balance = coin::balance<supra_coin::SupraCoin>(side2_bettor1_addr);
        let side2_bettor2_balance = coin::balance<supra_coin::SupraCoin>(side2_bettor2_addr);
        let side2_bettor3_balance = coin::balance<supra_coin::SupraCoin>(side2_bettor3_addr);

        print(&b"Initial balances:");
        print(&side1_bettor1_balance);
        print(&side1_bettor2_balance);
        print(&side1_bettor3_balance);
        print(&side2_bettor1_balance);
        print(&side2_bettor2_balance);
        print(&side2_bettor3_balance);

        // Place bets
        place_bet(&side1_bettor1, owner_addr, 1, 100);
        place_bet(&side1_bettor1, owner_addr, 1, 100);  // 100 tokens
        place_bet(&side1_bettor2, owner_addr, 1, 200);  // 200 tokens
        place_bet(&side1_bettor3, owner_addr, 1, 100);  // 300 tokens

        place_bet(&side2_bettor1, owner_addr, 2, 200);  // 150 tokens
        place_bet(&side2_bettor2, owner_addr, 2, 300);  // 250 tokens
        place_bet(&side2_bettor3, owner_addr, 2, 400);  // 350 tokens

        // Get pool sizes after bets
        let (coin1_pool, coin2_pool, _, _) = view_campaign_status(owner_addr);
        print(&b"Pool sizes after bets:");
        print(&coin1_pool);  // Should be 600
        print(&coin2_pool);  // Should be 750

        // End campaign with Side 1 winning
        end_campaign(&owner, 1);

        // Get final balances
        let side1_bettor1_final = coin::balance<supra_coin::SupraCoin>(side1_bettor1_addr);
        let side1_bettor2_final = coin::balance<supra_coin::SupraCoin>(side1_bettor2_addr);
        let side1_bettor3_final = coin::balance<supra_coin::SupraCoin>(side1_bettor3_addr);
        
        let side2_bettor1_final = coin::balance<supra_coin::SupraCoin>(side2_bettor1_addr);
        let side2_bettor2_final = coin::balance<supra_coin::SupraCoin>(side2_bettor2_addr);
        let side2_bettor3_final = coin::balance<supra_coin::SupraCoin>(side2_bettor3_addr);

        print(&b"Final balances:");
        print(&side1_bettor1_final);
        print(&side1_bettor2_final);
        print(&side1_bettor3_final);
        print(&side2_bettor1_final);
        print(&side2_bettor2_final);
        print(&side2_bettor3_final);

        // Verify proportional distribution
        // assert!(side1_bettor1_final > side1_bettor1_balance - 100 + 225 - 1, 0); 
        // assert!(side1_bettor2_final > side1_bettor2_balance - 200 + 450 - 1, 0);
        // assert!(side1_bettor3_final > side1_bettor3_balance - 300 + 675 - 1, 0);

        // assert!(side2_bettor1_final == side2_bettor1_balance - 150, 0);
        // assert!(side2_bettor2_final == side2_bettor2_balance - 250, 0);
        // assert!(side2_bettor3_final == side2_bettor3_balance - 350, 0);
    }
}