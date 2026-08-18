import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme, ActivityIndicator, View } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { PrepStoreProvider, usePrepStore } from '@/context/PrepStoreContext';

SplashScreen.preventAutoHideAsync();

function AppContent() {
  const { theme, loading } = usePrepStore();
  const systemColorScheme = useColorScheme();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: systemColorScheme === 'dark' ? '#000000' : '#ffffff' }}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  const isDark = theme === 'system' ? systemColorScheme === 'dark' : theme === 'dark';

  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <AppTabs />
    </ThemeProvider>
  );
}

export default function TabLayout() {
  return (
    <PrepStoreProvider>
      <AppContent />
    </PrepStoreProvider>
  );
}

