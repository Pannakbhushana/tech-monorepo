import '@/global.css';
import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#0f172a', // slate-900
    background: '#f8fafc', // slate-50
    backgroundElement: '#ffffff', // white
    backgroundSelected: '#e2e8f0', // slate-200
    textSecondary: '#64748b', // slate-500
    
    brand: '#4f46e5', // indigo-600
    brandBg: '#e0e7ff', // indigo-100
    accent: '#0d9488', // teal-600
    accentBg: '#ccfbf1', // teal-100
    
    success: '#10b981', // emerald-500
    successBg: '#d1fae5', // emerald-100
    warning: '#f59e0b', // amber-500
    warningBg: '#fef3c7', // amber-100
    danger: '#f43f5e', // rose-500
    dangerBg: '#ffe4e6', // rose-100
    
    border: '#e2e8f0', // slate-200
    card: '#ffffff',
    shadow: 'rgba(15, 23, 42, 0.08)',
  },
  dark: {
    text: '#f1f5f9', // slate-100
    background: '#020617', // slate-950
    backgroundElement: '#0f172a', // slate-900
    backgroundSelected: '#1e293b', // slate-800
    textSecondary: '#94a3b8', // slate-400
    
    brand: '#818cf8', // indigo-400
    brandBg: '#1e1b4b', // indigo-950
    accent: '#2dd4bf', // teal-400
    accentBg: '#115e59', // teal-950
    
    success: '#34d399', // emerald-400
    successBg: '#064e3b', // emerald-950
    warning: '#fbbf24', // amber-400
    warningBg: '#78350f', // amber-950
    danger: '#fb7185', // rose-400
    dangerBg: '#4c0519', // rose-950
    
    border: '#1e293b', // slate-800
    card: '#0f172a',
    shadow: 'rgba(0, 0, 0, 0.4)',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
