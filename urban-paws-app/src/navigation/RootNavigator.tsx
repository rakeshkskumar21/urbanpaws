import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { TabNavigator } from './TabNavigator';
import { LoginScreen } from '@/screens/LoginScreen';
import { OtpVerifyScreen } from '@/screens/OtpVerifyScreen';
import { HomeScreen } from '@/screens/HomeScreen';
import { LocationScreen } from '@/screens/LocationScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { EmergencyScreen } from '@/screens/EmergencyScreen';
import { ServiceDetailScreen } from '@/screens/ServiceDetailScreen';
import { BookingFlowScreen } from '@/screens/BookingFlowScreen';
import { BookingConfirmationScreen } from '@/screens/BookingConfirmationScreen';
import { TrackBookingScreen } from '@/screens/TrackBookingScreen';
import { FoodMenuScreen } from '@/screens/FoodMenuScreen';
import { ShopScreen } from '@/screens/ShopScreen';
import { CartScreen } from '@/screens/CartScreen';
import { CheckoutScreen } from '@/screens/CheckoutScreen';
import { AddPetScreen } from '@/screens/AddPetScreen';
import { AddressBookScreen, AddAddressScreen } from '@/screens/AddressScreens';
import { YourOrdersScreen } from '@/screens/YourOrdersScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="OtpVerify" component={OtpVerifyScreen} />
        <Stack.Screen name="Tabs" component={TabNavigator} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Location" component={LocationScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen
          name="Emergency"
          component={EmergencyScreen}
          options={{ animation: 'slide_from_bottom' }}
        />
        <Stack.Screen name="ServiceDetail" component={ServiceDetailScreen} />
        <Stack.Screen name="BookingFlow" component={BookingFlowScreen} />
        <Stack.Screen
          name="BookingConfirmation"
          component={BookingConfirmationScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen name="TrackBooking" component={TrackBookingScreen} />
        <Stack.Screen name="FoodMenu" component={FoodMenuScreen} />
        <Stack.Screen name="Shop" component={ShopScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen
          name="AddPet"
          component={AddPetScreen}
          options={{ animation: 'slide_from_bottom' }}
        />
        <Stack.Screen name="AddressBook" component={AddressBookScreen} />
        <Stack.Screen
          name="AddAddress"
          component={AddAddressScreen}
          options={{ animation: 'slide_from_bottom' }}
        />
        <Stack.Screen name="YourOrders" component={YourOrdersScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
