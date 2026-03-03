import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Colors } from '../constants/Colors';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';

function InitializingGuard({ children }: { children: React.ReactNode }) {
  const { isInitializing } = useAuth();
  if (isInitializing) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={Colors.dark.primary} />
      </View>
    );
  }
  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        <StatusBar style="light" />
        <InitializingGuard>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: Colors.dark.background,
            },
          }}
        >
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="kitchen/[id]"
            options={{
              headerShown: true,
              title: 'Kitchen Details',
              headerStyle: { backgroundColor: Colors.dark.card },
              headerTintColor: Colors.dark.text,
            }}
          />
          <Stack.Screen
            name="cart"
            options={{
              presentation: 'modal',
              headerShown: true,
              title: 'Your Cart',
              headerStyle: { backgroundColor: Colors.dark.card },
              headerTintColor: Colors.dark.text,
            }}
          />
        </Stack>
        </InitializingGuard>
      </CartProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.dark.background,
  },
});
