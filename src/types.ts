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

export type ComplaintCategory =
  | 'Food Quality & Freshness'
  | 'Missing / Incorrect Items'
  | 'Late or Cold Delivery'
  | 'Damaged Packaging / Spillage'
  | 'Service & Staff Experience'
  | 'Billing & Pricing Discrepancy'
  | 'Compliment & Culinary Feedback';

export type ComplaintSeverity = 'Low' | 'Medium' | 'High' | 'Urgent';

export type ComplaintStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Kitchen Investigating'
  | 'Compensation Issued'
  | 'Resolved';

export type DesiredResolution =
  | 'Full Refund'
  | 'Replacement Delivery'
  | 'Store Credit Voucher'
  | 'Chef Inspection & Direct Apology'
  | 'Other';

export interface TicketMessage {
  id: string;
  sender: 'customer' | 'support' | 'executive_chef';
  senderName: string;
  roleTitle?: string;
  message: string;
  timestamp: string;
}

export interface ComplaintTicket {
  id: string;
  orderId?: string;
  customerName: string;
  email: string;
  phone: string;
  category: ComplaintCategory;
  severity: ComplaintSeverity;
  subject: string;
  description: string;
  desiredResolution: DesiredResolution;
  images: string[];
  createdAt: string;
  status: ComplaintStatus;
  resolutionNotes?: string;
  compensationGranted?: string;
  messages: TicketMessage[];
  assignedTo?: string;
}
