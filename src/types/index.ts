
export type FamilyType = {
  creator: string,
  creatorName: string,
  familyAddress: string,
  familyId: number,
  name: string,
  members: FamilyMember[],
  proposals: FamilyProposals[],
  walletBalance: number
}

export type FamilyMember ={
  addr: string,
  isParent: boolean
  name: string,
}

export type FamilyProposals = {
  amount: number,
  description: string,
  endDate: number,
  proposer: string,
  recipient: string,
  status: ProposalStatus,
  title: string,
  votesAgainst: number,
  votesFor: number,
  hasVoted: boolean,
}

export interface TransactionState {
  status: 'idle' | 'pending' | 'success' | 'error';
  hash?: string;
  error?: string;
}

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

export const ProposalStatus = {
  Pending: 'pending',
  Approved: 'approved',
  Rejected: 'rejected',
  Executed: 'executed'
} as const;

export type ProposalStatus = typeof ProposalStatus[keyof typeof ProposalStatus];