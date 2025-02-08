import { Space, Strategy } from "./"

export type Proposal = {
    id: string;
    ipfs: string;
    space: Space;
    type: string;
    title: string;
    body: string;
    discussion: string;
    author: string;
    quorum: number;
    quorumType: string;
    start: number;
    end: number;
    snapshot: number;
    choices: string[];
    labels: string[];
    scores: number[];
    scores_total: number;
    scores_state: string;
    state: 'active' | 'closed';
    strategies: Strategy[];
    created: number;
    updated: number | null;
    votes: number;
    privacy: string;
    plugins: Record<string, unknown>;
    flagged: boolean;
  };