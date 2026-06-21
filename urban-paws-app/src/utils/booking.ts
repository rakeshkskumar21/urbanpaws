import { Booking, Service, PaymentMethod, TimeSlot } from '@/types';

export const PLATFORM_FEE = 1;
export const PARTNER_FEE_PER_KM = 2;

export function generateOtp(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

interface BuildBookingArgs {
  petId: string;
  service: Service;
  date: string;
  timeSlot: TimeSlot;
  addressId: string;
  paymentMethod: PaymentMethod;
  tip?: number;
  specialInstructions?: string;
}

export function buildBooking(args: BuildBookingArgs): Booking {
  const subtotal = args.service.priceFrom;
  const platformFee = PLATFORM_FEE;
  const partnerFee = PARTNER_FEE_PER_KM;
  const tip = args.tip ?? 0;
  const grandTotal = subtotal + platformFee + partnerFee + tip;

  return {
    id: generateId('book'),
    petId: args.petId,
    service: args.service,
    date: args.date,
    timeSlot: args.timeSlot,
    addressId: args.addressId,
    paymentMethod: args.paymentMethod,
    status: 'pending_confirmation',
    otp: generateOtp(),
    subtotal,
    platformFee,
    partnerFee,
    grandTotal,
    tip,
    specialInstructions: args.specialInstructions,
    createdAt: new Date().toISOString(),
  };
}

export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatTimeSlot(slot: TimeSlot): string {
  const [start, end] = slot.split('-');
  return `${to12Hour(start)} – ${to12Hour(end)}`;
}

function to12Hour(time: string): string {
  const [hStr, mStr] = time.split(':');
  let h = parseInt(hStr, 10);
  const suffix = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${mStr} ${suffix}`;
}
