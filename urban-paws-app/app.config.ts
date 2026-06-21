import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Urban Paws',
  slug: 'urban-paws',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  scheme: 'urbanpaws',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#FDFAF7',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.urbanpaws.app',
    infoPlist: {
      NSLocationWhenInUseUsageDescription:
        'Urban Paws uses your location to find nearby pet executives and track live walks.',
      NSCameraUsageDescription:
        'Urban Paws uses your camera to let you upload a profile photo for your pet.',
    },
  },
  android: {
    package: 'com.urbanpaws.app',
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#E8531A',
    },
    permissions: ['ACCESS_FINE_LOCATION', 'ACCESS_COARSE_LOCATION', 'CAMERA'],
  },
  web: {
    favicon: './assets/favicon.png',
  },
  extra: {
    apiBaseUrl: 'https://api.urbanpaws.in/v1',
  },
});
