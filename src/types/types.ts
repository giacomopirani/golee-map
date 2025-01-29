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

// Details Club
export interface ClubDetails {
  organizationId: string;
  name: string;
  logoUrl: string;
  slug: string;
  contacts: Contact[];
  address: Address;
  vatNumber: string;
  socialLinks?: SocialLinks;
  colors?: Colors;
  affiliate?: Affiliate;
  sports: string[];
  competitionLevel: "AMATEUR" | string;
  foundationYear: string;
  federations: Federation[];
}

export interface Contact {
  tel: string;
  email: string;
  _id: string;
}

export interface SocialLinks {
  web?: string;
  fb?: string;
  ig?: string;
  tw?: string;
  yt?: string;
}

export interface Colors {
  1: string;
  2: string;
  3: string;
}

export interface Affiliate {
  club_logo_url: string | null;
  club_name: string;
  club_link: string | null;
}

export interface Federation {
  name: string;
  number: string;
  affiliationDate: string;
}
