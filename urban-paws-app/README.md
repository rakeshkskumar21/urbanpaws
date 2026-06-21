# Urban Paws — Mobile App

A single TypeScript codebase (React Native + Expo) that builds native apps for **both Android and iOS**. This mirrors the Urban Paws website: pet walking, fresh food ordering, grooming, boarding, vaccination/medicine, pet taxi, insurance, a pet supplies shop, live booking tracking, and a 24/7 emergency flow.

## Why React Native + Expo

You asked for "the mobile app code for Android and iOS in TypeScript." There's no such thing as one native-iOS + native-Android codebase that's also literally TypeScript — iOS native is Swift, Android native is Kotlin/Java. React Native is the standard way to write **one TypeScript codebase** that compiles to true native apps on both platforms (it's what Shopify, Instagram, and Discord ship in production). Expo is the tooling layer on top that handles the native build pipeline, so you don't need Xcode/Android Studio set up locally to get started.

## Project structure

```
urban-paws-app/
├── App.tsx                      Entry point
├── app.config.ts                Expo config (app name, bundle IDs, permissions)
├── babel.config.js
├── tsconfig.json
├── eas.json                     Cloud build profiles (Android .apk/.aab, iOS .ipa)
├── package.json
└── src/
    ├── components/               Reusable UI: Button, Card, Badge, ServiceCard...
    ├── context/AppContext.tsx    Global state (cart, pets, bookings) via useReducer
    ├── data/                     Static catalogs: services, menu, shop products, breeds
    ├── navigation/                Stack + bottom tab navigators, route types
    ├── screens/                   One file per screen (see below)
    ├── theme/                     Colors, spacing, radius, typography tokens
    ├── types/                     Shared TypeScript interfaces (Booking, Pet, Service...)
    └── utils/booking.ts           Pricing, OTP generation, currency/time formatting
```

### Screens (maps 1:1 to the website's sections)

| Screen | Purpose |
|---|---|
| `LoginScreen` / `OtpVerifyScreen` | Phone number + OTP auth |
| `HomeScreen` | Service grid, emergency banner, live activity |
| `ServicesListScreen` | Full service catalog (tab) |
| `ServiceDetailScreen` | Feature list + price before booking |
| `BookingFlowScreen` | Breed picker, address, time slot, tip, payment, bill summary |
| `BookingConfirmationScreen` | OTP for the pet executive, bill recap |
| `TrackBookingScreen` | Live status timeline + call/chat with executive |
| `FoodMenuScreen` | Veg/non-veg filter, menu items, customizable add-ons |
| `ShopScreen` / `CartScreen` / `CheckoutScreen` | Pet supplies purchase flow |
| `EmergencyScreen` | SOS: medicine delivery, vet consult, urgent boarding |
| `AddPetScreen`, `AddressScreens`, `YourOrdersScreen`, `ProfileScreen` | Account management |

## Run it locally

```bash
cd urban-paws-app
npm install

npx expo start          # opens Metro bundler + QR code
```

Then either:
- **Physical phone**: install the **Expo Go** app (App Store / Play Store), scan the QR code. Fastest way to see it running on real Android and iOS hardware.
- **iOS Simulator** (macOS only, needs Xcode installed): press `i` in the terminal, or `npm run ios`.
- **Android Emulator** (needs Android Studio installed): press `a` in the terminal, or `npm run android`.

## Building real installable apps (.apk / .aab / .ipa)

You don't need a Mac to build the iOS app — Expo's cloud build service (EAS) compiles iOS binaries in the cloud.

```bash
npm install -g eas-cli
eas login
eas build:configure

# Android APK you can sideload directly to a phone
eas build --platform android --profile preview

# iOS simulator build (no Apple Developer account needed to test)
eas build --platform ios --profile preview

# Production builds for Play Store / App Store submission
eas build --platform android --profile production
eas build --platform ios --profile production
```

Publishing to stores requires:
- **Android**: a Google Play Developer account ($25 one-time)
- **iOS**: an Apple Developer Program account ($99/year)

`eas submit` can push the built binary straight to each store once you have those accounts.

## What's wired up vs. what needs your backend

This is a **complete, working app shell** with realistic in-memory state (React context) so every flow — booking a walk, ordering food, adding to cart, checkout, OTP confirmation, live status simulation — works end-to-end in the app right now, no backend required to demo it.

To go to production you'd connect:
- **Auth**: replace the mock OTP screen with real SMS OTP (Firebase Auth, MSG91, etc.)
- **`src/context/AppContext.tsx`**: swap local state for API calls to your backend (bookings, cart, addresses)
- **`src/screens/TrackBookingScreen.tsx`**: replace the simulated status timer with real-time updates (WebSocket or polling) and an actual map (`react-native-maps` is already installed)
- **Payments**: integrate Razorpay/Stripe for UPI, card, wallet
- **Push notifications**: `expo-notifications` for booking status updates

## Key files to read first

1. `src/types/index.ts` — every data shape in the app
2. `src/context/AppContext.tsx` — how state flows (cart, pets, bookings)
3. `src/navigation/types.ts` — every screen and its params, fully typed
4. `src/utils/booking.ts` — pricing logic (platform fee ₹1, partner fee ₹2/km, OTP generation)
