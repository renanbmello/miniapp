// import { NextResponse } from "next/server";
import { Proposal, Space } from "@/lib/types"
import { JsonService } from "@/lib/services"


interface ProposalsResponse {
  data: {
    proposals: Proposal[]
  }
}


import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { JsonRpcProvider, Contract, isAddress, TransactionResponse, Block } from "ethers";
import { LRUCache } from 'lru-cache';
import { RateLimiter } from 'limiter';
import mockProposals from "@/mock/proposals.json";

interface MockProposalData extends ProposalData {
    isMock: boolean
}

const MOCK_PROPOSALS: MockProposalData[] = [
    {
      contractAddress: "0xMockGovernorContract1",
      hasProposals: true,
      latestProposal: {
        exists: true,
        description: "Sample Proposal: Upgrade Protocol Version",
        votingDeadline: Math.floor(Date.now() / 1000) + 86400, // 24 hours from now
        yea: 1500,
        nay: 420
      },
      isMock: true
    },
    {
      contractAddress: "0xMockDAOContract2",
      hasProposals: true,
      latestProposal: {
        exists: true,
        description: "Sample DAO Proposal: Treasury Allocation",
        votingDeadline: Math.floor(Date.now() / 1000) + 172800, // 48 hours from now
        yea: 8920,
        nay: 1350
      },
      isMock: true
    }
];


export interface TransactionVote {
    id: string;
    voter: string;
    space: {
      id: string;
    };
    proposal: Proposal;
    choice: number;
    created: number;
  }
  
  interface TransactionsResponse {
    data: {
      votes: TransactionVote[];
    }
  }

// Cache configuration
const blockCache = new LRUCache({
    max: 100, // Store up to 100 blocks
    ttl: 1000 * 60 * 5, // Cache for 5 minutes
});

// Rate limiter: 5 requests per second
const limiter = new RateLimiter({
    tokensPerInterval: 5,
    interval: "second"
});

// Types for better type safety
interface ProposalTransaction {
    hash: string;
    from: string;
    to: string | null;
    data: string;
}

interface ProposalData {
    contractAddress: string;
    hasProposals: boolean;
    latestProposal: {
        exists: boolean;
        description?: string;
        votingDeadline?: number;
        yea?: number;
        nay?: number;
    };
}

function createCompleteSpace(spaceData: { id: string }): Space {
    return {
      id: spaceData.id,
      name: spaceData.id, // Using id as name since we don't have the actual name
      avatar: '', // Default empty avatar
      network: 'ethereum', // Default network
      admins: [], // Empty admins array
      moderators: [], // Empty moderators array
      symbol: '', // Empty symbol
      terms: null // No terms
    };
  }

// Common proposal function signatures to identify proposal contracts
const PROPOSAL_SIGNATURES = {
    // DAO styles
    "newProposal(address,uint256,string,bytes,uint256,bool)": "0x668f6e",
    "vote(uint256,bool)": "0xc9d27afe",
    // Governor style (OpenZeppelin)
    "propose(address[],uint256[],bytes[],string)": "0x7d5e81e2",
}

// Common functions found in proposal contracts
const PROPOSAL_CHECK_ABI = [ 
    "function proposals(uint256) view returns (tuple)",
    "function getProposal(uint256) view returns (tuple)",
    "function hasVoted(uint256,address) view returns (bool)",
    "function state(uint256) view returns (uint8)"
]

async function getBlockWithCache(provider: JsonRpcProvider, blockNumber: number): Promise<Block | null> {
    const cachedBlock = blockCache.get(blockNumber) as Block | undefined;
    if (cachedBlock) {
        return cachedBlock;
    }

    await limiter.removeTokens(1);
    const block = await provider.getBlock(blockNumber, true);
    if (block) {
        blockCache.set(blockNumber, block);
    }
    return block;
}

async function checkProposalContract(provider: JsonRpcProvider, address: string): Promise<boolean> {
    try {
        const contract = new Contract(address, PROPOSAL_CHECK_ABI, provider);
        await contract.proposals(0);
        return true;
    } catch {
        try {
            const contract = new Contract(address, PROPOSAL_CHECK_ABI, provider);
            await contract.getProposal(0);
            return true;
        } catch {
            return false;
        }
    }
}

async function getProposalData(provider: JsonRpcProvider, address: string): Promise<ProposalData | null> {
    try {
        const contract = new Contract(address, PROPOSAL_CHECK_ABI, provider);
        const proposal = await contract.proposals(0).catch(() => contract.getProposal(0));

        if (!proposal) return null;

        return {
            contractAddress: address,
            hasProposals: true,
            latestProposal: {
                exists: true,
                description: proposal.description || undefined,
                votingDeadline: proposal.votingDeadline?.toNumber() || undefined,
                yea: proposal.yea?.toNumber() || undefined,
                nay: proposal.nay?.toNumber() || undefined
            }
        };
    } catch (error) {
        console.error(`Error getting proposal data for ${address}:`, error);
        return null;
    }
}

export async function POST(req: NextRequest) {
    try {
        // Check rate limit
        const remaining = await limiter.tryRemoveTokens(1);
        if (!remaining) {
            return NextResponse.json({
                success: false,
                error: "Rate limit exceeded. Please try again later."
            }, { status: 429 });
        }

        let body;
        try {
            body = await req.json();
        } catch (error) {
            return NextResponse.json({
                success: false,
                error: error instanceof Error ? error.message : "Invalid JSON payload"
            }, { status: 400 });
        }

        
        // const body = await req.json();
        
        const userAddress = body?.userAddress?.toLowerCase();
        if (userAddress === "0xmock" || process.env.NODE_ENV === "development") {
            return NextResponse.json({
                success: true,
                proposalContracts: mockProposals.proposals,
                metadata: {
                    blocksScanned: 100,
                    transactionsFound: 5,
                    contractsAnalyzed: mockProposals.proposals.length,
                    isMockData: true
                }
            });
        } else if (!userAddress || !isAddress(userAddress)) {
            return NextResponse.json({
                success: false,
                error: "Invalid Ethereum address provided"
            }, { status: 400 });
        }
        
        const provider = new JsonRpcProvider(
            `https://rpc.sepolia.dev/${process.env.YOUR_INFURA_API_KEY}`
        );

        // Get block range
        const blockNumber = await provider.getBlockNumber();
        const transactions: ProposalTransaction[] = [];
        const processedBlocks = new Set();

        // Collect transactions from last 100 blocks
        for (let i = blockNumber; i > blockNumber - 100 && transactions.length < 10; i--) {
            if (processedBlocks.has(i)) continue;
            
            const block = await getBlockWithCache(provider, i);
            if (!block?.transactions) continue;
            
            processedBlocks.add(i);
            
            const blockTxs = block.transactions as unknown as TransactionResponse[];
            const userTxs = blockTxs
                .filter(tx => tx.from?.toLowerCase() === userAddress)
                .map(tx => ({
                    hash: tx.hash,
                    from: tx.from,
                    to: tx.to,
                    data: tx.data
                }));

            transactions.push(...userTxs.slice(0, 10 - transactions.length));
        }

        // Find proposal contracts
        const proposalContracts = new Set<string>();

        for (const tx of transactions) {
            if (!tx.to) continue;

            const txData = tx.data;
            const matchesProposalSignature = Object.values(PROPOSAL_SIGNATURES).some(
                sig => txData.startsWith(sig)
            );

            if (matchesProposalSignature || await checkProposalContract(provider, tx.to)) {
                proposalContracts.add(tx.to);
            }
        }

        // Get proposal data
        const proposalDataPromises = Array.from(proposalContracts)
            .map(address => getProposalData(provider, address));

        const proposalData = (await Promise.all(proposalDataPromises))
            .filter((data): data is ProposalData => data !== null);

        return NextResponse.json({ 
            success: true,
            proposalContracts: proposalData,
            metadata: {
                blocksScanned: processedBlocks.size,
                transactionsFound: transactions.length,
                contractsAnalyzed: proposalContracts.size,
                isMockData: false
            }
        });
        
    } catch (error) {
        console.error("Error processing transactions:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        
        return NextResponse.json({
            success: false,
            error: errorMessage,
            errorType: error instanceof Error ? error.constructor.name : 'Unknown'
        }, { status: 500 });
    }

    
}

// export async function GET() {
//     try {
//       const response = await JsonService.readJson<ProposalsResponse>('proposals.json');

//       return NextResponse.json({ data: response.data, success: true });
//     } catch (error) {
//       return NextResponse.json(
//         { error: error },
//         { status: 500 }
//       );
//     }
//   }

export async function GET(req: NextRequest) {
    try {
      const searchParams = req.nextUrl.searchParams;
      const userAddress = searchParams.get('address')?.toLowerCase();
  
      // If no address provided, return all proposals
      if (!userAddress) {
        const response = await JsonService.readJson<TransactionsResponse>('transactions.json');
        
        // Transform the votes data into the Proposal format expected by the frontend
        const proposals: Proposal[] = response.data.votes.map(vote => ({
          id: vote.proposal.id,
          ipfs: vote.id,
          space: createCompleteSpace(vote.space),
          type: 'single-choice',
          title: vote.proposal.title || 'Untitled Proposal',
          body: '',
          discussion: '',
          author: vote.voter,
          quorum: 0,
          quorumType: 'default',
          start: vote.created,
          end: vote.proposal.end,
          snapshot: 0,
          choices: vote.proposal.choices || ['For', 'Against', 'Abstain'],
          labels: [],
          scores: vote.proposal.scores || [0, 0, 0],
          scores_total: vote.proposal.scores?.reduce((a, b) => a + b, 0) || 0,
          scores_state: 'final',
          state: vote.proposal.state || 'closed',
          strategies: [],
          created: vote.created,
          updated: null,
          votes: vote.proposal.votes || 0,
          privacy: 'public',
          plugins: {},
          flagged: false
        }));
  
        // Remove duplicates based on proposal ID
        const uniqueProposals = Array.from(
          new Map(proposals.map(item => [item.id, item])).values()
        );
  
        return NextResponse.json({ 
          data: { proposals: uniqueProposals }, 
          success: true 
        });
      }
  
      // If address is provided, filter by voter address
      const response = await JsonService.readJson<TransactionsResponse>('transactions.json');
  
      const votes: TransactionVote[] = response.data.votes
  
      return NextResponse.json({ 
        data: { proposals: votes }, 
        success: true 
      });
  
    } catch (error) {
      console.error("Error fetching proposals:", error);
      return NextResponse.json(
        { 
          success: false, 
          error: error instanceof Error ? error.message : "Failed to fetch proposals" 
        },
        { status: 500 }
      );
    }
  }


export async function GETbyAddress(req: NextRequest, { params }: { params: { address: string } }) {
    try {
        const response = await JsonService.readJson<ProposalsResponse>('proposals.json');

       const addressProposals = response.data.proposals.filter(proposal => 
            proposal.space?.id?.toLowerCase() === params.address.toLowerCase()
        );

        console.log(addressProposals);

        if (!addressProposals.length) {
            return NextResponse.json({
                success: false,
                error: "No proposals found for the given address"
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            proposals: addressProposals
        });

    } catch (error) {
        return NextResponse.json({
            success: false,
            error: "Error fetching proposals"
        }, { status: 500 });
    }
}

