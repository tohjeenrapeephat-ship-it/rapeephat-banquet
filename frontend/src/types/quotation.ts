export interface DishItem {
  id: string;
  name: string;
  nameEn?: string;
  description?: string;
  isSpecial?: boolean;
  tag?: string;
  imageUrl?: string;
}

export interface CourseCategory {
  id: string;
  courseIndex: number;
  title: string;
  description?: string;
  options: DishItem[];
  defaultDishId: string;
}

export interface PackageTier {
  id: string;
  price: number;
  name: string;
  tag?: string;
  description: string;
  dishCount: number;
  isPopular?: boolean;
  highlight?: string;
  courses: CourseCategory[];
}

export interface BeverageSet {
  id: string;
  name: string;
  pricePerTable: number;
  description: string;
  items: string[];
}

export interface CustomerInfo {
  name: string;
  phone: string;
  email?: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  eventType: string;
  locationZone?: 'bkk_metro' | 'upcountry';
  notes?: string;
}

export interface SelectedDishMap {
  [courseId: string]: string; // courseId -> dishId
}

export interface QuotationDoc {
  id?: string;
  quoteNo: string;
  createdAt: string;
  customer: CustomerInfo;
  package: {
    id: string;
    name: string;
    price: number;
  };
  selectedDishes: {
    courseId: string;
    courseTitle: string;
    dishName: string;
  }[];
  tableCount: number;
  freeTableCount: number;
  beverage?: {
    id: string;
    name: string;
    pricePerTable: number;
    total: number;
  };
  floorService: {
    enabled: boolean;
    pricePerTable: number;
    total: number;
  };
  travelFee?: {
    amount: number;
    description: string;
    zone: 'bkk_metro' | 'upcountry';
    isFree: boolean;
  };
  subtotal: number;
  discount: number;
  grandTotal: number;
  depositAmount: number;
  finalAmount: number;
  pdfDriveUrl?: string;
  status: 'pending' | 'deposit_paid' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  updatedAt?: number;
}
