export interface SushiItem {
  id: string;
  name: string;
  japaneseName?: string;
  description: string;
  price: number;
  category: 'rolls' | 'sashimi' | 'nigiri' | 'starters' | 'desserts' | 'beverages';
  image: string;
  isChefSpecial?: boolean;
  collection?: string;
  calories?: number;
  pieces?: string;
  spicy?: boolean;
  popular?: boolean;
  glutenFree?: boolean;
  tags?: string[];
}

export interface CartItemOption {
  spiciness: 'Mild' | 'Medium' | 'Signature Hot';
  extraWasabi: boolean;
  extraGinger: boolean;
  riceType: 'Traditional White' | 'Organic Brown';
  notes?: string;
}

export interface CartItem {
  cartItemId: string;
  sushiItem: SushiItem;
  quantity: number;
  options: CartItemOption;
}

export type OrderStatus = 'Received' | 'Kitchen' | 'Seared' | 'Delivery' | 'Delivered';

export interface Order {
  id: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  customerName: string;
  email: string;
  phone: string;
  deliveryAddress: string;
  paymentMethod: 'card' | 'applepay' | 'cash';
  estimatedMinutes: number;
}

export interface CSharpFile {
  id: string;
  filename: string;
  path: string;
  language: 'csharp' | 'xml' | 'json';
  content: string;
  description: string;
}
