export type RootStackParamList = {
  Tabs: undefined;
  Home: undefined;
  Location: undefined;
  Profile: undefined;
  Emergency: undefined;
  ServiceDetail: { serviceId: string };
  BookingFlow: { serviceId: string };
  BookingConfirmation: { bookingId: string };
  TrackBooking: { bookingId: string };
  FoodMenu: undefined;
  MenuItemDetail: { menuItemId: string };
  Shop: undefined;
  ProductDetail: { productId: string };
  Cart: undefined;
  Checkout: undefined;
  AddPet: undefined;
  AddressBook: undefined;
  AddAddress: undefined;
  YourOrders: undefined;
  Login: undefined;
  OtpVerify: { mobile: string };
};

export type TabParamList = {
  HomeTab: undefined;
  ServicesTab: undefined;
  ShopTab: undefined;
  OrdersTab: undefined;
  ProfileTab: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
