// Customer types
export interface Customer {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
}

// Equipment types
export interface Equipment {
  id: number;
  name: string;
  description?: string;
  quantity: number;
  hourly_price: number;
  daily_price: number;
  weekly_price: number;
  monthly_price: number;
}

// Order types
export interface Order {
  order_id: number;
  customer: string;
  equipment_details: string;
  rental_start: string;
  rental_end: string;
  total_price: number;
}

export interface OrderEquipment {
  equipment_id: string;
  quantity: number;
  rental_period: 'hourly' | 'daily' | 'weekly' | 'monthly';
  discount: number;
  calculated_price: number;
}

export interface OrderFormData {
  customer_id: string;
  rental_start: string;
  rental_end: string;
  equipment: OrderEquipment[];
}

// Calendar types
export interface CalendarEvent {
  id: number;
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  backgroundColor: string;
  borderColor: string;
}

// Utility types
export interface ComboboxOption {
  value: string;
  label: string;
}
