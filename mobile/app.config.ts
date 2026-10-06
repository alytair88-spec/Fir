import type { ExpoConfig } from 'expo/config';

// Google Maps keys are needed for Android builds (and for Google Maps on iOS;
// iOS uses Apple Maps by default). They are not needed in Expo Go during development.
const androidGoogleMapsApiKey = process.env.GOOGLE_MAPS_ANDROID_API_KEY;
const iosGoogleMapsApiKey = process.env.GOOGLE_MAPS_IOS_API_KEY;

const config: ExpoConfig = {
  name: 'Hungary City Map',
  slug: 'hungary-city-map',
  scheme: 'hungarycitymap',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.example.hungarycitymap',
  },
  android: {
    package: 'com.example.hungarycitymap',
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage: './assets/android-icon-foreground.png',
      backgroundImage: './assets/android-icon-background.png',
      monochromeImage: './assets/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
  },
  web: {
    favicon: './assets/favicon.png',
  },
  plugins: [
    'expo-router',
    'expo-localization',
    [
      'expo-location',
      {
        locationWhenInUsePermission: 'Show your position on the map to find places nearby.',
      },
    ],
    ['react-native-maps', { androidGoogleMapsApiKey, iosGoogleMapsApiKey }],
  ],
  experiments: {
    typedRoutes: true,
  },
};

export default config;
