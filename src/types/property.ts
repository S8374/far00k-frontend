export interface PreviewProperty {
  title: string;
  location: string;
  price: string;
  sizeM2: string;
  sizeSqft: string;
  roi: string;

  images: string[];
  description: string;

  monthlyRent: string;
  annualReturn: string;
  appreciation: string;

  mapImage: string;
}
export type Property = {
  images: string[];
  badge?: string | null;
  verified?: boolean;
  trophy?: boolean;
  price: string;
  title: string;
  subtitle: string;
  roi: string;
  area: string;
  id?: string | number;
  latitude?: number;
  longitude?: number;
  views?: number;
};

export interface PropertyCardProps {
  property: Property;
  onCardClick?: () => void;
  showLocationButton?: boolean;
  onViewLocation?: () => void;
}

// new code azha