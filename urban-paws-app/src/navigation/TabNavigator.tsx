import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { TabParamList } from './types';
import { colors } from '@/theme';
import { HomeScreen } from '@/screens/HomeScreen';
import { ServicesListScreen } from '@/screens/ServicesListScreen';
import { ShopScreen } from '@/screens/ShopScreen';
import { YourOrdersScreen } from '@/screens/YourOrdersScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';

const Tab = createBottomTabNavigator<TabParamList>();

const ICONS: Record<keyof TabParamList, keyof typeof Ionicons.glyphMap> = {
  HomeTab: 'home',
  ServicesTab: 'grid',
  ShopTab: 'bag-handle',
  OrdersTab: 'receipt',
  ProfileTab: 'person-circle',
};

export function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.paw,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.cardBg,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={ICONS[route.name as keyof TabParamList]} size={size - 4} color={color} />
        ),
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen
        name="ServicesTab"
        component={ServicesListScreen}
        options={{ title: 'Services' }}
      />
      <Tab.Screen name="ShopTab" component={ShopScreen} options={{ title: 'Shop' }} />
      <Tab.Screen
        name="OrdersTab"
        component={YourOrdersScreen}
        options={{ title: 'Orders' }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}
