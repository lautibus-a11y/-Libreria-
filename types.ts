
export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  description: string;
  category: string;
  coverImage: string;
  pdfPreviewUrl?: string;
  stock: number;
  isFeatured?: boolean;
}

export interface Review {
  id: string;
  bookId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'delivered' | 'cancelled';
  customerName: string;
  date: string;
}

export interface AppSettings {
  whatsappNumber: string;
  authorName: string;
  authorBio: string;
  authorImage: string;
  categories: string[];
}

export enum Page {
  Home = 'home',
  Catalog = 'catalog',
  Detail = 'detail',
  Admin = 'admin',
  Login = 'login',
  Cart = 'cart'
}
