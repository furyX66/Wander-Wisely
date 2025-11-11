export interface IAttraction {
  id: number;
  title: string;
  latitude: number;
  longitude: number;
  type: string;
  rating: number;
  price: number | null;
  imageUrl: string | null;
}
