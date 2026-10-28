import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useSyncExternalStore } from 'react';
import { AppState, useColorScheme } from 'react-native';

import { useWardrobe } from '@/stores/wardrobe';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const hydrated = useSyncExternalStore(
    useWardrobe.persist.onFinishHydration,
    useWardrobe.persist.hasHydrated,
    () => false,
  );

  useEffect(() => {
    if (!hydrated) return;
    SplashScreen.hideAsync();

    // Açılışta ve uygulama her ön plana geldiğinde bekleyen değişiklikleri gönder.
    const sync = () => useWardrobe.getState().syncPending();
    sync();
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') sync();
    });
    return () => subscription.remove();
  }, [hydrated]);

  if (!hydrated) return null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="item/new" options={{ title: 'Yeni parça', presentation: 'modal' }} />
        <Stack.Screen name="item/[id]" options={{ title: 'Parça' }} />
      </Stack>
    </ThemeProvider>
  );
}
