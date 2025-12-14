export interface ITripAttraction {
  id: number;
  orderIndex: number;
  status: string;
  attractionId: number;
  name: string;
  latitude?: number;
  longitude?: number;
  imageUrl?: string | null;
  price?: string | null;
}
