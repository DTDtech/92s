// Customer types
export interface Customer {
  id: number;
  name: string;
  address?: string;
  phone_number?: string;
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
// Define types for the response
export interface OrderItem {
  name: string;
  quantity: number;
  rental_price: number;
  item_total: number;
}

export interface Order {
  order_id: number;
  customer: string;
  equipment_items: OrderItem[];
  total_price: number;
  rental_start: string;
  rental_end: string;
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

export interface Handover {
  handover_id: number;
  handover_date: string;
  status: string;
  customer_document_image: string;
  equipment_images: string[];
  personal_document_note: string;
  document_note: string;
  equipment_items: HandoverEquipment[];
}

export interface HandoverFormData {
  handover_date: string;
  status: string;
  customer_document_image: File;
  equipment_images: File[];
  personal_document_note: string;
  document_note: string;
  equipment: HandoverEquipment[];
}

export interface HandoverEquipment {
  equipment_id: string;
  quantity: number;
  condition: string;
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
