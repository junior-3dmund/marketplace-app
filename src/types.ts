export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  location: string;
  sellerName: string;
  sellerType: 'Individual' | 'Shop';
  image: string;
  description: string;
  condition: string;
  isFeatured: boolean;
  listedAt: string;
}
