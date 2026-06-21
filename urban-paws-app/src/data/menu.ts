import { MenuItem, AddOn } from '@/types';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'menu-rice-curd',
    name: 'Rice & Curd',
    description: 'Freshly cooked rice with curd. No preservatives.',
    weightApprox: '300g',
    price: 30,
    diet: 'veg',
    icon: 'rice',
  },
  {
    id: 'menu-rice-chicken',
    name: 'Rice & Chicken',
    description: 'Freshly cooked rice + chicken 100g, with a pinch of turmeric.',
    weightApprox: '450g',
    price: 80,
    diet: 'non_veg',
    icon: 'drumstick',
  },
  {
    id: 'menu-rice-raw-egg',
    name: 'Rice & Raw Egg',
    description: 'Rice with raw egg. Rich in protein.',
    weightApprox: '400g',
    price: 75,
    diet: 'non_veg',
    icon: 'egg',
  },
  {
    id: 'menu-rice-milk',
    name: 'Rice & Milk',
    description: 'Freshly cooked rice with full-fat milk. Easy digestion.',
    weightApprox: '300g',
    price: 30,
    diet: 'veg',
    icon: 'milk',
  },
  {
    id: 'menu-chicken-carrots',
    name: 'Chicken & Carrots',
    description: 'Chicken 100g + freshly cooked carrots. High fibre.',
    weightApprox: '400g',
    price: 75,
    diet: 'non_veg',
    icon: 'carrot',
  },
  {
    id: 'menu-rice-boiled-egg',
    name: 'Rice & Boiled Egg',
    description: 'Rice + boiled egg (1). Great for puppies.',
    weightApprox: '400g',
    price: 40,
    diet: 'non_veg',
    icon: 'egg',
  },
];

export const ADD_ONS: AddOn[] = [
  { id: 'addon-carrots', name: 'Carrots (59g)', price: 5 },
  { id: 'addon-chickpeas', name: 'Chick peas (30g)', price: 5 },
  { id: 'addon-raw-egg', name: 'Raw Egg (1)', price: 5 },
  { id: 'addon-boiled-egg', name: 'Boiled Egg (1)', price: 10 },
  { id: 'addon-pedigree', name: 'Dry pedigree', price: 10 },
  { id: 'addon-wheat-bread', name: 'Wheat Bread (5 pieces)', price: 10 },
  { id: 'addon-sweet-bread', name: 'Sweet Bread (5 pieces)', price: 10 },
  { id: 'addon-milk-bowl', name: 'Bowl of milk', price: 10 },
];
