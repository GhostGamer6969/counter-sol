use anchor_lang::{system_program::System, prelude::*};

declare_id!("EATyi5BQDDkfvGh6Vzkpw6UtzqdQ8iu3TyiFNgUYBFZz");

#[program]
pub mod counter {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        ctx.accounts.new_counter_account.count= 1;
        msg!("current count: {:?}", ctx.accounts.new_counter_account.count);
        Ok(())
    }
    pub fn count_up(ctx: Context<CountU>) -> Result<()> {
        let counter_account = &mut ctx.accounts.counter_account;
        counter_account.count +=1;
        msg!("new count: {:?}", counter_account.count);
        Ok(())
    }
    pub fn count_down(ctx: Context<CountD>) -> Result<()> {
        let counter_account = &mut ctx.accounts.counter_account;
        counter_account.count -=1;
        msg!("new count: {:?}", counter_account.count);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init_if_needed,
        seeds = [b"count"],
        bump,
        payer = signer,
        space = 8 + 1,
    )]
    pub new_counter_account: Account<'info,CountAccount>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info,System>
}

#[account]
pub struct CountAccount{
    count: u8,
}
#[derive(Accounts)]
pub struct CountU<'info>{
    #[account(mut)]
    pub counter_account: Account<'info,CountAccount>,
}
#[derive(Accounts)]
pub struct CountD<'info>{
    #[account(mut)]
    pub counter_account: Account<'info,CountAccount>,
}
