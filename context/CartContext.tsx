import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useAuth } from './AuthContext';

export interface CartItem {
    item: any;
    quantity: number;
}

interface CartContextType {
    cartItems: CartItem[];
    kitchenId: string | null;
    addToCart: (item: any, quantity?: number, kitchenId?: string) => Promise<void>;
    removeFromCart: (itemId: string) => Promise<void>;
    updateQuantity: (itemId: string, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    totalAmount: number;
    count: number;
}

const CartContext = createContext<CartContextType>({
    cartItems: [],
    kitchenId: null,
    addToCart: async () => { },
    removeFromCart: async () => { },
    updateQuantity: async () => { },
    clearCart: async () => { },
    totalAmount: 0,
    count: 0,
});

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [kitchenId, setKitchenId] = useState<string | null>(null);

    // Load cart when user changes
    useEffect(() => {
        loadCart();
    }, [user]);

    const getCartKey = () => {
        if (!user) return null;
        return `cart_${user.id || user.token}`; // Fallback to token if id missing, but per-user key is the goal
    };

    const loadCart = async () => {
        const key = getCartKey();
        if (!key) {
            setCartItems([]);
            setKitchenId(null);
            return;
        }

        try {
            const savedCart = await SecureStore.getItemAsync(key);
            const savedKitchenId = await SecureStore.getItemAsync(`${key}_kitchen_id`);

            if (savedCart && savedKitchenId) {
                const parsedCart = JSON.parse(savedCart);
                // The saved cart might be just { itemId: quantity } or explicit items.
                // based on previous implementation it was { itemId: quantity }.
                // But wait, the previous implementation in `cart.tsx` fetched menu items again.
                // To minimize conflicting with old data structure, let's start fresh or check structure.
                // Actually, I'll redesign to store full items + quantity to avoid refetching everything constantly,
                // OR I can store { itemId: quantity } and fetch.
                // Fetching ensures price freshness. Storing avoids network.
                // Let's store compact { itemId, quantity } and maybe cached basic info.

                // For robustness, let's stick to the previous pattern: store ID+Qty, fetch details.
                // BUT `cart.tsx` logic was: fetch ALL menu items for kitchen, then map.
                // This is heavy if menu is large.
                // Better: Store { id, quantity, price, name } at least.
                // Let's check what `kitchen/[id].tsx` was doing. It was storing `{ itemId: quantity }`.

                // I will try to support the legacy format if exists, but migrate to array of objects.
                // Actually, user said "work on the cart, its not well implemented".
                // So I can define my own storage format.

                // Let's store: { kitchenId, items: [{ item, quantity }] }
                // Wait, I am restricted to what `SecureStore` can hold (string).

                // Reading logic from scratch:
                // If I find old format (just object of numbers), I'll try to convert or just clear it.
                // Since user wants "new user new cart", and we are changing keys, old keys `cart` and `cart_kitchen_id` (global) are ignored for logged in users.
                // This implicitly solves "new cart" for existing users too if they login.

                // Let's stick to storing full `cartItems` array stringified.
                // It's easier.
                setCartItems(parsedCart);
                setKitchenId(savedKitchenId);
            } else {
                setCartItems([]);
                setKitchenId(null);
            }
        } catch (error) {
            console.error('Failed to load cart', error);
        }
    };

    const saveCart = async (newItems: CartItem[], newKitchenId: string | null) => {
        const key = getCartKey();
        if (!key) return;

        try {
            if (newItems.length === 0) {
                await SecureStore.deleteItemAsync(key);
                await SecureStore.deleteItemAsync(`${key}_kitchen_id`);
            } else {
                await SecureStore.setItemAsync(key, JSON.stringify(newItems));
                if (newKitchenId) {
                    await SecureStore.setItemAsync(`${key}_kitchen_id`, newKitchenId);
                }
            }
        } catch (error) {
            console.error('Failed to save cart', error);
        }
    };

    const addToCart = async (item: any, quantity = 1, kId?: string) => {
        if (!user) {
            Alert.alert('Please login', 'You need to be logged in to add items to cart.');
            return;
        }

        if (!kId) {
            // If kId is missing, we can try to use existing kitchenId if exists, or just warn.
            // For now, let's assume if not passed, we might be increasing quantity of existing item?
            // But existing item check is inside addItemHelper.
            // Let's just log warn and return or proceed if we don't care about kitchen strictness for updates.
            // But valid use case is adding from specific kitchen.
            if (!kitchenId) {
                console.warn("Adding to cart without kitchenId");
                // Proceeding might be dangerous for order grouping.
                return;
            }
            kId = kitchenId;
        }

        if (kitchenId && kId !== kitchenId) {
            Alert.alert(
                'Start new order?',
                'You have items from another kitchen in your cart. clear them?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Yes',
                        onPress: async () => {
                            const newItems = [{ item, quantity }];
                            setCartItems(newItems);
                            setKitchenId(kId!); // We know kId is defined here because of check above
                            await saveCart(newItems, kId!);
                        }
                    }
                ]
            );
            return;
        }

        await addItemHelper(item, quantity, kId);
    };

    const addItemHelper = async (item: any, quantity: number, kId: string) => {
        let newItems = [...cartItems];
        const existingIndex = newItems.findIndex(i => i.item.id === item.id);

        if (existingIndex >= 0) {
            newItems[existingIndex].quantity += quantity;
        } else {
            newItems.push({ item, quantity });
        }

        setCartItems(newItems);
        setKitchenId(kId);
        await saveCart(newItems, kId);
    };

    const removeFromCart = async (itemId: string) => {
        const newItems = cartItems.filter(i => i.item.id !== itemId);
        setCartItems(newItems);
        if (newItems.length === 0) {
            setKitchenId(null);
            await saveCart([], null);
        } else {
            await saveCart(newItems, kitchenId);
        }
    };

    const updateQuantity = async (itemId: string, quantity: number) => {
        if (quantity <= 0) {
            await removeFromCart(itemId);
            return;
        }

        const newItems = cartItems.map(i => {
            if (i.item.id === itemId) {
                return { ...i, quantity };
            }
            return i;
        });

        setCartItems(newItems);
        await saveCart(newItems, kitchenId);
    };

    const clearCart = async () => {
        setCartItems([]);
        setKitchenId(null);
        const key = getCartKey();
        if (key) {
            await SecureStore.deleteItemAsync(key);
            await SecureStore.deleteItemAsync(`${key}_kitchen_id`);
        }
    };

    const totalAmount = cartItems.reduce((total, { item, quantity }) => total + (Number(item.price) * quantity), 0);
    const count = cartItems.reduce((total, { quantity }) => total + quantity, 0);

    return (
        <CartContext.Provider value={{ cartItems, kitchenId, addToCart, removeFromCart, updateQuantity, clearCart, totalAmount, count }}>
            {children}
        </CartContext.Provider>
    );
};
