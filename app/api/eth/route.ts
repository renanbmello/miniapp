/*
// const theDAOAddress="0xbb9bc244d798123fde783fcc1c72d3bb8c189413"

// const theDAOInterfaceABI = [
//     {
//         constant: true,
//         inputs: [{ name: "", type: "uint256" }],
//         name: "proposals",
//         outputs: [
//             { name: "recipient", type: "address" },
//             { name: "amount", type: "uint256" },
//             { name: "description", type: "string" },
//             { name: "votingDeadline", type: "uint256" },
//             { name: "open", type: "bool" },
//             { name: "proposalPassed", type: "bool" },
//             { name: "proposalHash", type: "bytes32" },
//             { name: "proposalDeposit", type: "uint256" },
//             { name: "newCurator", type: "bool" },
//             { name: "yea", type: "uint256" },
//             { name: "nay", type: "uint256" },
//             { name: "creator", type: "address" },
//         ],
//         type: "function",
//     },
//     {
//         constant: true,
//         inputs: [],
//         name: "rewardAccount",
//         outputs: [{ name: "", type: "address" }],
//         type: "function",
//     },
//     {
//         constant: true,
//         inputs: [],
//         name: "daoCreator",
//         outputs: [{ name: "", type: "address" }],
//         type: "function",
//     },
//     {
//         constant: false,
//         inputs: [
//             { name: "_proposalID", type: "uint256" },
//             { name: "_transactionData", type: "bytes" },
//         ],
//         name: "executeProposal",
//         outputs: [{ name: "_success", type: "bool" }],
//         type: "function",
//     },
//     {
//         constant: false,
//         inputs: [],
//         name: "unblockMe",
//         outputs: [{ name: "", type: "bool" }],
//         type: "function",
//     },
//     {
//         constant: true,
//         inputs: [],
//         name: "totalRewardToken",
//         outputs: [{ name: "", type: "uint256" }],
//         type: "function",
//     },
//     {
//         constant: true,
//         inputs: [{ name: "", type: "address" }],
//         name: "allowedRecipients",
//         outputs: [{ name: "", type: "bool" }],
//         type: "function",
//     },
//     {
//         constant: false,
//         inputs: [
//             { name: "_to", type: "address" },
//             { name: "_amount", type: "uint256" },
//         ],
//         name: "transferWithoutReward",
//         outputs: [{ name: "success", type: "bool" }],
//         type: "function",
//     },
//     {
//         constant: false,
//         inputs: [
//             { name: "_recipient", type: "address" },
//             { name: "_amount", type: "uint256" },
//             { name: "_description", type: "string" },
//             { name: "_transactionData", type: "bytes" },
//             { name: "_debatingPeriod", type: "uint256" },
//             { name: "_newCurator", type: "bool" },
//         ],
//         name: "newProposal",
//         outputs: [{ name: "_proposalID", type: "uint256" }],
//         type: "function",
//     },
//     {
//         constant: true,
//         inputs: [{ name: "", type: "address" }],
//         name: "DAOpaidOut",
//         outputs: [{ name: "", type: "uint256" }],
//         type: "function",
//     },
//     {
//         constant: true,
//         inputs: [],
//         name: "minQuorumDivisor",
//         outputs: [{ name: "", type: "uint256" }],
//         type: "function",
//     },
//     {
//         constant: false,
//         inputs: [{ name: "_newContract", type: "address" }],
//         name: "newContract",
//         outputs: [],
//         type: "function",
//     },
//     {
//         constant: false,
//         inputs: [
//             { name: "_recipient", type: "address" },
//             { name: "_allowed", type: "bool" },
//         ],
//         name: "changeAllowedRecipients",
//         outputs: [{ name: "_success", type: "bool" }],
//         type: "function",
//     },
//     {
//         constant: false,
//         inputs: [],
//         name: "halveMinQuorum",
//         outputs: [{ name: "_success", type: "bool" }],
//         type: "function",
//     },
//     {
//         constant: true,
//         inputs: [{ name: "", type: "address" }],
//         name: "paidOut",
//         outputs: [{ name: "", type: "uint256" }],
//         type: "function",
//     },
//     {
//         constant: false,
//         inputs: [
//             { name: "_proposalID", type: "uint256" },
//             { name: "_newCurator", type: "address" },
//         ],
//         name: "splitDAO",
//         outputs: [{ name: "_success", type: "bool" }],
//         type: "function",
//     },
//     {
//         constant: true,
//         inputs: [],
//         name: "DAOrewardAccount",
//         outputs: [{ name: "", type: "address" }],
//         type: "function",
//     },
//     {
//         constant: true,
//         inputs: [],
//         name: "proposalDeposit",
//         outputs: [{ name: "", type: "uint256" }],
//         type: "function",
//     },
//     {
//         constant: true,
//         inputs: [],
//         name: "numberOfProposals",
//         outputs: [{ name: "_numberOfProposals", type: "uint256" }],
//         type: "function",
//     },
//     {
//         constant: true,
//         inputs: [],
//         name: "lastTimeMinQuorumMet",
//         outputs: [{ name: "", type: "uint256" }],
//         type: "function",
//     },
//     {
//         constant: false,
//         inputs: [{ name: "_toMembers", type: "bool" }],
//         name: "retrieveDAOReward",
//         outputs: [{ name: "_success", type: "bool" }],
//         type: "function",
//     },
//     {
//         constant: false,
//         inputs: [],
//         name: "receiveEther",
//         outputs: [{ name: "", type: "bool" }],
//         type: "function",
//     },
//     {
//         constant: true,
//         inputs: [{ name: "_proposalID", type: "uint256" }],
//         name: "getNewDAOAddress",
//         outputs: [{ name: "_newDAO", type: "address" }],
//         type: "function",
//     },
//     {
//         constant: false,
//         inputs: [
//             { name: "_proposalID", type: "uint256" },
//             { name: "_supportsProposal", type: "bool" },
//         ],
//         name: "vote",
//         outputs: [{ name: "_voteID", type: "uint256" }],
//         type: "function",
//     },
//     {
//         constant: false,
//         inputs: [],
//         name: "getMyReward",
//         outputs: [{ name: "_success", type: "bool" }],
//         type: "function",
//     },
//     {
//         constant: true,
//         inputs: [{ name: "", type: "address" }],
//         name: "rewardToken",
//         outputs: [{ name: "", type: "uint256" }],
//         type: "function",
//     },
//     {
//         constant: false,
//         inputs: [
//             { name: "_from", type: "address" },
//             { name: "_to", type: "address" },
//             { name: "_amount", type: "uint256" },
//         ],
//         name: "transferFromWithoutReward",
//         outputs: [{ name: "success", type: "bool" }],
//         type: "function",
//     },
//     {
//         constant: false,
//         inputs: [{ name: "_proposalDeposit", type: "uint256" }],
//         name: "changeProposalDeposit",
//         outputs: [],
//         type: "function",
//     },
//     {
//         constant: true,
//         inputs: [{ name: "", type: "address" }],
//         name: "blocked",
//         outputs: [{ name: "", type: "uint256" }],
//         type: "function",
//     },
//     {
//         constant: true,
//         inputs: [],
//         name: "curator",
//         outputs: [{ name: "", type: "address" }],
//         type: "function",
//     },
//     {
//         constant: true,
//         inputs: [
//             { name: "_proposalID", type: "uint256" },
//             { name: "_recipient", type: "address" },
//             { name: "_amount", type: "uint256" },
//             { name: "_transactionData", type: "bytes" },
//         ],
//         name: "checkProposalCode",
//         outputs: [{ name: "_codeChecksOut", type: "bool" }],
//         type: "function",
//     },
//     {
//         anonymous: false,
//         inputs: [
//             { indexed: true, name: "proposalID", type: "uint256" },
//             { indexed: false, name: "recipient", type: "address" },
//             { indexed: false, name: "amount", type: "uint256" },
//             { indexed: false, name: "newCurator", type: "bool" },
//             { indexed: false, name: "description", type: "string" },
//         ],
//         name: "ProposalAdded",
//         type: "event",
//     },
//     {
//         anonymous: false,
//         inputs: [
//             { indexed: true, name: "proposalID", type: "uint256" },
//             { indexed: false, name: "position", type: "bool" },
//             { indexed: true, name: "voter", type: "address" },
//         ],
//         name: "Voted",
//         type: "event",
//     },
//     {
//         anonymous: false,
//         inputs: [
//             { indexed: true, name: "proposalID", type: "uint256" },
//             { indexed: false, name: "result", type: "bool" },
//             { indexed: false, name: "quorum", type: "uint256" },
//         ],
//         name: "ProposalTallied",
//         type: "event",
//     },
//     {
//         anonymous: false,
//         inputs: [{ indexed: true, name: "_newCurator", type: "address" }],
//         name: "NewCurator",
//         type: "event",
//     },
//     {
//         anonymous: false,
//         inputs: [
//             { indexed: true, name: "_recipient", type: "address" },
//             { indexed: false, name: "_allowed", type: "bool" },
//         ],
//         name: "AllowedRecipientChanged",
//         type: "event",
//     },
// ];

        // const daoContract = new Contract(theDAOAddress, theDAOInterfaceABI, provider);
        // const blockByNumber = await provider.send("eth_getBlockByNumber", ["pending", false]);
        // const transactions = blockByNumber.transactions;

        // const first50Transactions = transactions.slice(0, 10);
        // console.log("First 50 transactions:", first50Transactions);

                // const latestBlock = await provider.getBlock(blockNumber);
*/

import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { eth } from "web3"
import { JsonRpcProvider, Contract, isAddress, TransactionResponse, Block } from "ethers"


interface ProposalTransaction {
    hash: string;
    from: string;
    to: string | null;
    data: string;
}

// Common proposal function signatures to identify proposal contracts
const PROPOSAL_SIGNATURES = {
    // DAO styles
    "newProposal(address,uint256,string,bytes,uint256,bool)": "0x668f6e",
    "vote(uint256,bool)": "0xc9d27afe",
    // Governor style (OpenZeppelin)
    "propose(address[],uint256[],bytes[],string)": "0x7d5e81e2",
}

// Common functions found in proposal contracts, used to check if proposal-related contract
const PROPOSAL_CHECK_ABI = [ 
    "function proposals(uint256) view returns (tuple)",
    "function getProposal(uint256) view returns (tuple)",
    "function hasVoted(uint256,address) view returns (bool)",
    "function state(uint256) view returns (uint8)"
]

export async function POST(req: NextRequest) {
    try {

        
        const provider = new JsonRpcProvider(`https://rpc.sepolia.dev/${process.env.YOUR_INFURA_API_KEY}`);
        const body = await req.json();
        const userAddress = body.userAddress;

        if (!isAddress(userAddress)) {
            throw new Error("Invalid user address");
        }

        const blockNumber = await provider.getBlockNumber();

        const transactions: ProposalTransaction[] = [];

        for (let i = blockNumber; i > blockNumber - 100 && transactions.length < 10; i--) {
            const block = await provider.getBlock(i, true);
            if (!block || !block.transactions) continue;
            
            const blockTxs = block.transactions as unknown as TransactionResponse[];
            const userTxs = blockTxs
                .filter(tx => tx.from?.toLowerCase() === userAddress.toLowerCase())
                .map(tx => ({
                    hash: tx.hash,
                    from: tx.from,
                    to: tx.to,
                    data: tx.data
                }));

            transactions.push(...userTxs.slice(0, 10 - transactions.length));
        }

        const proposalContracts = new Set<string>();

        for (const tx of transactions) {
            if (!tx.to) continue;

            try {
                const txData = tx.data;

                const matchesProposalSignature = Object.values(PROPOSAL_SIGNATURES).some(
                    sig => txData.startsWith(sig)
                );

                if (matchesProposalSignature) {
                    proposalContracts.add(tx.to);
                } else {
                    const contract = new Contract(tx.to, PROPOSAL_CHECK_ABI, provider);
                    try {
                        await contract.proposals(0);
                        proposalContracts.add(tx.to);
                    } catch {}
                }
            } catch (error) {
                continue;
            }
        }

        const proposalData = [];
        const contractAddresses = Array.from(proposalContracts);

        for (const contractAddress of contractAddresses) {
            try {
                const contract = new Contract(contractAddress, PROPOSAL_CHECK_ABI, provider);
                const proposal = await contract.proposals(0).catch(() =>
                    contract.getProposal(0)
                );

                if (proposal) {
                    proposalData.push({
                        contractAddress,
                        hasProposals: true,
                        latestProposal: {
                            exists: true,
                        }
                    });
                }
            } catch {
                continue;
            }
        }
    
        return NextResponse.json({ 
            success: true,
            proposalContracts: proposalData
        });
        
    } catch (error) {
        console.error("Error processing transactions:", error);
        return NextResponse.json({
            success: false,
            error: "Failed to process transactions"
        }, { status: 500 });
    }
}
