// types/property.ts
export interface Property {
  id: string;
  listingAgentId: string;
  status: string;
  listingPurpose: 'SELL' | 'RENT';
  type: string;
  developerId: string;
  images: string[];
  totalUnits: number;
  availableUnits: number;
  latitude: number;
  longitude: number;
  addressLine: string;
  mapEmbedUrl: string;
  location: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  areaSqm: number;
  areaSqFt: number;
  bedrooms: number;
  bathrooms: number;
  balconies: number;
  floorNumber: number;
  yearBuilt: number;
  parkingSlots: number;
  furnished: boolean;
  isBooked: boolean;
  isRegaVerified: boolean;
  sakNumber: string;
  roiProjectionPercent: number;
  estimatedRentalIncome: number;
  estimatedRentalCurrency: string;
  valueApproximate: number;
  valueApproximateCurrency: string;
  views: number;
  featuredUntil: string | null;
  createdAt: string;
  updatedAt: string;
  agent: Agent;
  developer: Developer;
  attributes: any[];
  media: any[];
}

export interface Agent {
  userId: string;
  licenseId: string;
  agencyName: string;
  isRegaVerified: boolean;
  isNafathVerified: boolean;
  trustScore: number;
  bio: string;
  yearsExperience: number;
  verifiedAt: string | null;
  user: User;
}

export interface User {
  fullName: string;
  email: string;
  phoneNumber: string;
  avatarUrl: string;
}

export interface Developer {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  websiteUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyCardProps {
  property: Property;
}