import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Counter } from "../target/types/counter";
import { assert } from "chai";

describe("counter", () => {
    // Configure the client to use the local cluster.
    anchor.setProvider(anchor.AnchorProvider.env());

    const program = anchor.workspace.counter as Program<Counter>;
    const wallet = anchor.workspace.counter.provider.wallet;

    const [newCounterAccount] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("count", "utf8")],
        program.programId
    )
    it("Is initialized!", async () => {
        // Add your test here.
        const tx = await program.methods.initialize()
            .accounts({
                newCounterAccount: newCounterAccount,
                signer: wallet.PublicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
            }).rpc();
        console.log("Your transaction signature", tx);
        const counterAccount = await program.account.countAccount.fetch(
            newCounterAccount
        )
        assert(counterAccount.count == 1)
        console.log(
            "current count is:",
            counterAccount.count.toString()
        )
    })
    it("count up", async () => {
        for (let i = 0; i < 10; i++) {
            const tx = await program.methods
                .countUp()
                .accounts({
                    counterAccount: newCounterAccount,
                })
                .rpc()
        }
        const counterAccount = await program.account.countAccount.fetch(
            newCounterAccount
        )
        assert(counterAccount.count == 11)
        console.log(
            "current count is:",
            counterAccount.count.toString()
        )
    })
    it("count down", async () => {
        for (let i = 0; i < 3; i++) {
            const tx = await program.methods
                .countDown()
                .accounts({
                    counterAccount: newCounterAccount,
                })
                .rpc()
        }
        const counterAccount = await program.account.countAccount.fetch(
            newCounterAccount
        )
        assert(counterAccount.count == 8)
        console.log(
            "current count is:",
            counterAccount.count.toString()
        )
    })
});
