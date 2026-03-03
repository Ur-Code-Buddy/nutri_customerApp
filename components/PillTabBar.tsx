import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TAB_BAR_COLORS = {
  surfaceElevated: '#252528',
  borderLight: '#3a3a3c',
  primary: '#FF6B35',
  textTertiary: '#636366',
} as const;

const TAB_ICONS: Record<
  string,
  { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }
> = {
  index: { active: 'restaurant', inactive: 'restaurant-outline' },
  orders: { active: 'list', inactive: 'list-outline' },
  profile: { active: 'person', inactive: 'person-outline' },
};

export function PillTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { bottom: insets.bottom + 10 },
      ]}
      pointerEvents="box-none"
    >
      <View
        style={[
          styles.pill,
          Platform.select({
            ios: styles.pillShadowIOS,
            default: styles.pillShadowAndroid,
          }),
        ]}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const iconConfig = TAB_ICONS[route.name] ?? {
            active: 'ellipse',
            inactive: 'ellipse-outline',
          };

          const onPress = () => {
            if (Platform.OS === 'ios') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          const color = isFocused ? TAB_BAR_COLORS.primary : TAB_BAR_COLORS.textTertiary;
          const iconName = isFocused ? iconConfig.active : iconConfig.inactive;

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabButton}
            >
              <Ionicons name={iconName} size={22} color={color} />
              <Text
                style={[
                  styles.label,
                  { color },
                ]}
                numberOfLines={1}
              >
                {options.title ?? route.name}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '85%',
    height: 65,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: TAB_BAR_COLORS.surfaceElevated,
    borderRadius: 999,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: TAB_BAR_COLORS.borderLight,
  },
  pillShadowIOS: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  pillShadowAndroid: {
    elevation: 30,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.2,
    marginTop: 2,
  },
});
