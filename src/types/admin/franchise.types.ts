export type FranchiseType = "STORE" | "CENTRAL_KITCHEN";
export type FranchiseStatus = "ACTIVE" | "INACTIVE";

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

// ================= WORK ASSIGNMENT =================

export type WorkAssignmentType = 'FRANCHISE' | 'CENTRAL_KITCHEN';

export interface UserWorkAssignment {
  userId: number;
  assignmentType: WorkAssignmentType;
  franchiseId: number | null;
  centralKitchenId: number | null;
  assignedAt: string;
}

export interface AssignedUserItem {
  userId: number;
  username: string;
  email: string;
  roleName: string;

  assignmentType: WorkAssignmentType;
  franchiseId: number | null;
  centralKitchenId: number | null;

  assignedAt: string;
}
