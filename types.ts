
export enum UserRole {
  CONSUMER = 'CONSUMER',
  COURIER = 'COURIER',
  BUSINESS = 'BUSINESS',
  HUB_OWNER = 'HUB_OWNER'
}

export interface Landmark {
  id: string;
  name: string;
  description: string;
  category: 'spaza' | 'transport' | 'house' | 'other';
  coordinates: { x: number; y: number };
  image?: string;
  isVerified?: boolean;
}

export interface Incident {
  id: string;
  type: 'protest' | 'roadblock' | 'accident' | 'high-risk';
  severity: 'low' | 'medium' | 'high';
  description: string;
  location: { x: number; y: number };
  timestamp: number;
}

export interface Delivery {
  id: string;
  title: string;
  from: string;
  to: string;
  status: 'pending' | 'accepted' | 'in-transit' | 'delivered';
  fee: number;
  landmarkDescription: string;
  courierId?: string;
  pickupCoords: { x: number; y: number };
  dropoffCoords: { x: number; y: number };
  evidenceImage?: string;
}

export interface SpazaShop extends Landmark {
  owner: string;
  isHub: boolean;
  activeDeliveries: number;
  inventory: string[];
}
