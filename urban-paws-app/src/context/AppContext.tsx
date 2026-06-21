import React, {
  createContext,
  useContext,
  useReducer,
  useMemo,
  PropsWithChildren,
} from 'react';
import {
  Booking,
  CartItem,
  Pet,
  Address,
  EmergencyRequest,
} from '@/types';
import { SAMPLE_ADDRESSES } from '@/data/shop';

interface AppState {
  pets: Pet[];
  selectedPetId: string | null;
  addresses: Address[];
  cart: CartItem[];
  bookings: Booking[];
  emergencyRequests: EmergencyRequest[];
}

type AppAction =
  | { type: 'ADD_PET'; pet: Pet }
  | { type: 'SELECT_PET'; petId: string }
  | { type: 'ADD_TO_CART'; item: CartItem }
  | { type: 'REMOVE_FROM_CART'; itemId: string }
  | { type: 'UPDATE_CART_QTY'; itemId: string; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'ADD_BOOKING'; booking: Booking }
  | { type: 'UPDATE_BOOKING_STATUS'; bookingId: string; status: Booking['status'] }
  | { type: 'ADD_ADDRESS'; address: Address }
  | { type: 'ADD_EMERGENCY_REQUEST'; request: EmergencyRequest };

const initialState: AppState = {
  pets: [
    {
      id: 'pet-bruno',
      name: 'Bruno',
      breed: 'Labrador Retriever',
      ageGroup: '1_3_years',
      gender: 'male',
      species: 'dog',
    },
  ],
  selectedPetId: 'pet-bruno',
  addresses: SAMPLE_ADDRESSES,
  cart: [],
  bookings: [],
  emergencyRequests: [],
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_PET':
      return { ...state, pets: [...state.pets, action.pet], selectedPetId: action.pet.id };
    case 'SELECT_PET':
      return { ...state, selectedPetId: action.petId };
    case 'ADD_TO_CART': {
      const existing = state.cart.find((c) => c.refId === action.item.refId);
      if (existing) {
        return {
          ...state,
          cart: state.cart.map((c) =>
            c.refId === action.item.refId
              ? { ...c, quantity: c.quantity + action.item.quantity }
              : c
          ),
        };
      }
      return { ...state, cart: [...state.cart, action.item] };
    }
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter((c) => c.id !== action.itemId) };
    case 'UPDATE_CART_QTY':
      return {
        ...state,
        cart: state.cart
          .map((c) =>
            c.id === action.itemId ? { ...c, quantity: action.quantity } : c
          )
          .filter((c) => c.quantity > 0),
      };
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    case 'ADD_BOOKING':
      return { ...state, bookings: [action.booking, ...state.bookings] };
    case 'UPDATE_BOOKING_STATUS':
      return {
        ...state,
        bookings: state.bookings.map((b) =>
          b.id === action.bookingId ? { ...b, status: action.status } : b
        ),
      };
    case 'ADD_ADDRESS':
      return { ...state, addresses: [...state.addresses, action.address] };
    case 'ADD_EMERGENCY_REQUEST':
      return {
        ...state,
        emergencyRequests: [action.request, ...state.emergencyRequests],
      };
    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  cartTotal: number;
  cartCount: number;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const cartTotal = useMemo(
    () => state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [state.cart]
  );

  const cartCount = useMemo(
    () => state.cart.reduce((sum, item) => sum + item.quantity, 0),
    [state.cart]
  );

  const value = useMemo(
    () => ({ state, dispatch, cartTotal, cartCount }),
    [state, cartTotal, cartCount]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
