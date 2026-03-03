/**
 * Theme colors for themed components (ThemedText, ThemedView, etc.)
 * Aligned with design system: dark background #0F0F0F, surfaces #252528, accent #FF6B35
 */

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#F5F5F7',
    background: '#0F0F0F',
    tint: '#FF6B35',
    icon: '#8E8E93',
    tabIconDefault: '#8E8E93',
    tabIconSelected: '#FF6B35',
  },
  dark: {
    text: '#F5F5F7',
    background: '#0F0F0F',
    tint: '#FF6B35',
    icon: '#8E8E93',
    tabIconDefault: '#8E8E93',
    tabIconSelected: '#FF6B35',
  },
};

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
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
