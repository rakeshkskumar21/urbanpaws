import { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';

export type ServiceCategory =
  | 'walking'
  | 'feeding'
  | 'grooming'
  | 'boarding'
  | 'vaccination'
  | 'taxi'
  | 'insurance'
  | 'sitting';

export type IoniconName = ComponentProps<typeof Ionicons>['name'];

export interface Service {
  id: string;
  category: ServiceCategory;
  title: string;
  description: string;
  icon: IoniconName;
  priceFrom: number;
  priceUnit: string;
  tag?: string;
}

export type PetGender = 'male' | 'female';

export interface Pet {
  id: string;
  name: string;
  breed: string;
  ageGroup: AgeGroup;
  gender: PetGender;
  species: 'dog' | 'cat';
  photoUrl?: string;
}

export type AgeGroup =
  | 'under_6_months'
  | '6_12_months'
  | '1_3_years'
  | '3_7_years'
  | '7_plus_years';

export interface Address {
  id: string;
  label: string;
  line: string;
  city: string;
  isDefault?: boolean;
}

export type DietType = 'veg' | 'non_veg';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  weightApprox: string;
  price: number;
  diet: DietType;
  icon: string;
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
}

export interface ShopProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  category: 'grooming' | 'feeding' | 'accessory' | 'safety';
}

export type TimeSlot =
  | '06:00-07:00'
  | '07:00-08:00'
  | '08:00-09:00'
  | '09:00-10:00'
  | '16:00-17:00'
  | '17:00-18:00'
  | '18:00-19:00';

export type PaymentMethod = 'upi' | 'cash' | 'card' | 'wallet';

export type BookingStatus =
  | 'pending_confirmation'
  | 'confirmed'
  | 'on_the_way'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface Booking {
  id: string;
  petId: string;
  service: Service;
  date: string;
  timeSlot: TimeSlot;
  addressId: string;
  paymentMethod: PaymentMethod;
  status: BookingStatus;
  otp: string;
  platformFee: number;
  partnerFee: number;
  subtotal: number;
  grandTotal: number;
  tip: number;
  specialInstructions?: string;
  executive?: PetExecutive;
  createdAt: string;
}

export interface PetExecutive {
  id: string;
  name: string;
  rating: number;
  photoUrl?: string;
  vehicleNumber?: string;
  phone: string;
}

export interface CartItem {
  id: string;
  refId: string;
  name: string;
  price: number;
  quantity: number;
  kind: 'menu_item' | 'add_on' | 'shop_product';
}

export interface EmergencyRequest {
  id: string;
  type: 'medicine_delivery' | 'vet_consult' | 'urgent_boarding';
  petId: string;
  notes: string;
  status: 'requested' | 'dispatched' | 'resolved';
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  dateOfBirth?: string;
  gender?: string;
}
