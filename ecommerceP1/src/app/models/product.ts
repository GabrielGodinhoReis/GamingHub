export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  promotionalPrice?: number | null;
  imageUrl: string;
  bannerUrl: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  category: string;
  featured?: boolean;
};
