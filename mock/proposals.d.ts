declare module '@/mock/proposals.json' {
    import { ProposalData } from '@/app/api/proposals/route';
    
    interface MockProposals {
      proposals: Array<ProposalData & {
        isMock?: boolean;
        latestProposal: {
          votingDeadline: number;
          yea: number;
          nay: number;
        }
      }>;
    }
  
    const data: MockProposals;
    export default data;
  }