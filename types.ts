
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  SELLER = 'SELLER',
  ADMIN = 'ADMIN'
}

export enum OrderStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  AWAITING_VERIFICATION = 'AWAITING_VERIFICATION',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
}

export interface Cake {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

export interface CartItem {
  cakeId: string;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  paymentProof?: string; // base64 or URL
  paymentMethod?: string;
  paymentVerified?: boolean;
  customerInfo?: {
    name: string;
    phone: string;
    address: string;
  };
}

export interface OrderItem {
  cakeId: string;
  quantity: number;
  price: number;
  name?: string;
}

export type View = 'HOME' | 'CATALOG' | 'PRODUCT_DETAIL' | 'CART' | 'ORDERS' | 'SELLER_DASHBOARD' | 'ADMIN_DASHBOARD' | 'LOGIN' | 'REGISTER' | 'CHECKOUT';
