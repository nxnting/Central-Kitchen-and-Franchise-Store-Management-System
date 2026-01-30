export type FranchiseType = 'STORE' | 'CENTRAL_KITCHEN';
export type FranchiseStatus = 'ACTIVE' | 'INACTIVE';

export interface AdminFranchise {
  franchiseId: number;
  name: string;
  type: FranchiseType;
  status: FranchiseStatus;
  address: string;
  location: string;
}

export interface CreateFranchisePayload {
  name: string;
  type: FranchiseType;
  status: FranchiseStatus;
  address: string;
  location: string;
}

export interface UpdateFranchisePayload {
  name: string;
  type: FranchiseType;
  status: FranchiseStatus;
  address: string;
  location: string;
}
