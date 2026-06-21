import { Service } from '@/types';

export const SERVICES: Service[] = [
  {
    id: 'svc-walking',
    category: 'walking',
    title: 'Pet Walking',
    description:
      'Professional pet executives take your dog for a 20–30 min walk. Live GPS tracking, paw cleaning on return & route recorded.',
    icon: 'walk',
    priceFrom: 89,
    priceUnit: 'walk',
    tag: 'Most popular',
  },
  {
    id: 'svc-feeding',
    category: 'feeding',
    title: 'Fresh Pet Food',
    description:
      'Freshly cooked meals delivered in 30–35 min. Veg & non-veg options from a cloud kitchen with vet-approved ingredients.',
    icon: 'restaurant',
    priceFrom: 30,
    priceUnit: 'bowl',
  },
  {
    id: 'svc-grooming',
    category: 'grooming',
    title: 'Washing & Grooming',
    description:
      'Full bath, blow dry, nail clipping, ear cleaning, and breed-specific grooming at your doorstep.',
    icon: 'cut',
    priceFrom: 499,
    priceUnit: 'session',
  },
  {
    id: 'svc-boarding',
    category: 'boarding',
    title: 'Pet Boarding',
    description:
      'Heading out of the city for 24+ hours? Leave your dog or cat with our verified host families. Daily updates guaranteed.',
    icon: 'home',
    priceFrom: 599,
    priceUnit: 'night',
  },
  {
    id: 'svc-vaccination',
    category: 'vaccination',
    title: 'Vaccination & Medicine',
    description:
      'Vet visits at home for scheduled vaccinations, medicine delivery within 2 hours, and health check-ups.',
    icon: 'medkit',
    priceFrom: 299,
    priceUnit: 'visit',
  },
  {
    id: 'svc-taxi',
    category: 'taxi',
    title: 'Pet Taxi & Transport',
    description:
      'Dedicated Maruti Omni transport for your pets — no more rejection from autos or cabs. Safe, calm, air-conditioned rides.',
    icon: 'car',
    priceFrom: 199,
    priceUnit: 'trip',
  },
  {
    id: 'svc-insurance',
    category: 'insurance',
    title: 'Pet Insurance',
    description:
      'Affordable health coverage for accidents, illnesses, and surgeries. Get a quote and enroll in under 5 minutes.',
    icon: 'shield-checkmark',
    priceFrom: 999,
    priceUnit: 'year',
  },
  {
    id: 'svc-sitting',
    category: 'sitting',
    title: 'Pet Sitting',
    description:
      'In-home sitting while you are at work. Our sitter comes to you — no displacement stress for your pet.',
    icon: 'heart',
    priceFrom: 299,
    priceUnit: 'session',
  },
];

export const getServiceByCategory = (category: string): Service | undefined =>
  SERVICES.find((s) => s.category === category);
