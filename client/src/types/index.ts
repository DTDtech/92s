export interface Customer {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  created_at?: string;
}

export interface Equipment {
  id: number;
  name: string;
  description?: string;
  quantity: number;
  hourly_price: number;
  daily_price: number;
  weekly_price: number;
  monthly_price: number;
  created_at?: string;
}

export interface OrderEquipment {
  equipment_id: string;
  quantity: number;
  rental_period: 'hourly' | 'daily' | 'weekly' | 'monthly';
  discount: number;
  calculated_price: number;
}

export interface Order {
  order_id: number;
  customer: string;
  equipment_details: string;
  rental_start: string;
  rental_end: string;
  total_price: string;
}

export interface OrderFormData {
  customer_id: string;
  rental_start: string;
  rental_end: string;
  equipment: OrderEquipment[];
}

export interface ComboboxOption {
  value: string;
  label: string;
}
