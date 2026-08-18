import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme, ActivityIndicator, View, Platform } from 'react-native';
import { useEffect } from 'react';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { PrepStoreProvider, usePrepStore } from '@/context/PrepStoreContext';

SplashScreen.preventAutoHideAsync();

function AppContent() {
  const { theme, loading } = usePrepStore();
  const systemColorScheme = useColorScheme();

  const isDark = theme === 'system' ? systemColorScheme === 'dark' : theme === 'dark';

  useEffect(() => {
    if (Platform.OS === 'web') {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(isDark ? 'dark' : 'light');
      window.document.body.style.backgroundColor = isDark ? '#020617' : '#f8fafc';
    }
  }, [isDark]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: systemColorScheme === 'dark' ? '#000000' : '#ffffff' }}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

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

