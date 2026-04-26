export enum LeadStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  INTERESTED = 'interested',
  REJECTED = 'rejected'
}

export interface Lead {
  id: string;
  userId: string;
  name: string;
  niche: string;
  location: string;
  phone?: string;
  email?: string;
  website?: string;
  rating?: number;
  reviews?: number;
  status: LeadStatus;
  score: number;
  summary?: string;
  outreachMessage?: string;
  createdAt: any;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: any;
}
