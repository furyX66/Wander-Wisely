export interface Attraction {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  type: string;
  rating: number;
  price: number | null;
  photoUrl: string | null;
}
