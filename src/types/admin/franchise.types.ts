export type FranchiseType = 'STORE' | 'CENTRAL_KITCHEN';
export type FranchiseStatus = 'ACTIVE' | 'INACTIVE';

export interface AdminFranchise {
  franchiseId: number;
  name: string;
  type: FranchiseType;
  status: FranchiseStatus;
  address: string;
  location: string;

  latitude: number;
  longitude: number;
}

export interface CreateFranchisePayload {
  name: string;
  type: FranchiseType;
  status: FranchiseStatus;
  address: string;
  location: string;

  latitude: number;
  longitude: number;
}

export interface UpdateFranchisePayload {
  name: string;
  type: FranchiseType;
  status: FranchiseStatus;
  address: string;
  location: string;

  latitude: number;
  longitude: number;
}
