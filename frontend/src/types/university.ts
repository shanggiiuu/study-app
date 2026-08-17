export interface University {
  id: number;
  name: string;
  country: string;
  city: string | null;
  website: string | null;
  description: string | null;
  programs: string[];
  tuition: number | null;
  currency: string | null;
  acceptanceRate: number | null;
  ranking: number | null;
}

export interface UniversitySearchParams {
  name?: string;
  country?: string;
  city?: string;
  program?: string;
}
