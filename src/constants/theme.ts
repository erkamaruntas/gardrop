/**
 * Renk token'ları. Tasarım dili ve kullanım kuralları: DESIGN.md
 * Arayüz tek renklidir; renk kıyafet fotoğraflarından gelir.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#111111',
    background: '#FFFFFF',
    backgroundElement: '#F5F5F3',
    backgroundSelected: '#EBEBE8',
    textSecondary: '#6B6B6B',
    border: '#E4E4E0',
    accent: '#111111',
    onAccent: '#FFFFFF',
    danger: '#B3261E',
  },
  dark: {
    text: '#F5F5F3',
    background: '#0E0E0E',
    backgroundElement: '#1A1A1A',
    backgroundSelected: '#262626',
    textSecondary: '#9A9A9A',
    border: '#2A2A2A',
    accent: '#F5F5F3',
    onAccent: '#111111',
    danger: '#F2B8B5',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
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
