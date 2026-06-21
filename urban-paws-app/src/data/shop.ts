import { ShopProduct, Address } from '@/types';

export const SHOP_PRODUCTS: ShopProduct[] = [
  {
    id: 'shop-shampoo',
    name: 'Pet Shampoo',
    description: 'Hypoallergenic, vet-approved',
    price: 349,
    icon: 'shampoo',
    category: 'grooming',
  },
  {
    id: 'shop-soap',
    name: 'Pet Soap',
    description: 'Oatmeal & aloe vera',
    price: 199,
    icon: 'soap',
    category: 'grooming',
  },
  {
    id: 'shop-brush',
    name: 'Grooming Brush',
    description: 'Dematting & detangling',
    price: 449,
    icon: 'brush',
    category: 'grooming',
  },
  {
    id: 'shop-bowl-set',
    name: 'Food & Water Bowl',
    description: 'Stainless steel, anti-tip',
    price: 599,
    icon: 'bowl',
    category: 'feeding',
  },
  {
    id: 'shop-id-tag',
    name: 'ID Tag',
    description: 'Laser engraved, custom',
    price: 149,
    icon: 'tag',
    category: 'accessory',
  },
  {
    id: 'shop-leash',
    name: 'Retractable Leash',
    description: '5m, reflective, padded handle',
    price: 799,
    icon: 'leash',
    category: 'accessory',
  },
  {
    id: 'shop-shoes',
    name: 'Pet Shoes',
    description: 'Anti-slip, waterproof 4-pack',
    price: 699,
    icon: 'shoes',
    category: 'safety',
  },
  {
    id: 'shop-paw-balm',
    name: 'Paw Balm',
    description: 'Soothes cracked paws',
    price: 249,
    icon: 'balm',
    category: 'grooming',
  },
];

export const BREEDS: string[] = [
  'Indian Breed (Desi)',
  'Labrador Retriever',
  'Beagle',
  'German Shepherd',
  'Siberian Husky',
  'Rottweiler',
  'Shih Tzu',
  'Dobermann',
  'American Bully',
  'Pomeranian',
  'Persian Cat',
  'Other',
];

export const SAMPLE_ADDRESSES: Address[] = [
  {
    id: 'addr-home',
    label: 'Home',
    line: '575, Hongasandra, Mico Layout',
    city: 'Bengaluru',
    isDefault: true,
  },
];

export const CITIES: string[] = [
  'Bengaluru',
  'Mumbai',
  'Delhi NCR',
  'Pune',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Ahmedabad',
];
