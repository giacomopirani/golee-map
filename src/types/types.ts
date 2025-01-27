export interface Address {
  coordinates: [number, number];
  address: string;
  country: string;
  zone: string;
  region: string;
  town: string;
  postal_code: string;
}

export interface Organization {
  name: string;
  organizationId: string;
  logo_url: string;
  sport: string[];
  registrationYear: number;
  address: Address;
}

export interface Filters {
  name: string;
  province: string;
  sport: string;
}
