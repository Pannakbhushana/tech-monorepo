import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';
import { usePrepStore } from '@/context/PrepStoreContext';

export function useTheme() {
  const { theme } = usePrepStore();
  const systemColorScheme = useColorScheme();

  const activeScheme = theme === 'system'
    ? (systemColorScheme === 'dark' ? 'dark' : 'light')
    : theme;

  return Colors[activeScheme];
}
