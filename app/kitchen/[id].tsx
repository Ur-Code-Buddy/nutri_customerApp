import { useLocalSearchParams, useRouter } from 'expo-router';
import { Plus, ShoppingCart } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useCart } from '../../context/CartContext';
import { kitchenService } from '../../services/api';

export default function KitchenDetailsScreen() {
    const { id } = useLocalSearchParams();
    const [kitchen, setKitchen] = useState<any>(null);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    // const [cart, setCart] = useState<{ [key: string]: number }>({}); // Removed local cart
    const { addToCart, count } = useCart(); // Use global cart
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [kitchenData, menuData] = await Promise.all([
                    kitchenService.getById(id as string),
                    kitchenService.getMenu(id as string)
                ]);
                setKitchen(kitchenData);
                setMenuItems(menuData);
                // Cart loading is handled by CartContext
            } catch (error) {
                console.error('Failed to fetch kitchen details', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleAddToCart = async (item: any) => {
        await addToCart(item, 1, id as string);
    };

    const renderMenuItem = ({ item }: { item: any }) => (
        <View style={styles.menuItem}>
            <Image source={{ uri: item.image_url || 'https://via.placeholder.com/150' }} style={styles.menuImage} />
            <View style={styles.menuContent}>
                <Text style={styles.menuName}>{item.name}</Text>
                <Text style={styles.menuDesc} numberOfLines={2}>{item.description}</Text>
                <View style={styles.priceRow}>
                    <Text style={styles.price}>${item.price}</Text>
                    <TouchableOpacity style={styles.addButton} onPress={() => handleAddToCart(item)}>
                        <Plus size={16} color="white" />
                        <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={Colors.dark.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {kitchen && (
                <View style={styles.header}>
                    <Text style={styles.title}>{kitchen.name}</Text>
                    <Text style={styles.subtitle}>{kitchen.description}</Text>
                </View>
            )}

            <FlatList
                data={menuItems}
                renderItem={renderMenuItem}
                keyExtractor={(item: any) => item.id}
                contentContainerStyle={styles.listContent}
            />

            {count > 0 && (
                <View style={styles.floatingCartContainer}>
                    <TouchableOpacity style={styles.floatingCart} onPress={() => router.push('/cart')}>
                        <View style={styles.cartInfo}>
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{count}</Text>
                            </View>
                            <Text style={styles.viewCartText}>View Cart</Text>
                        </View>
                        <ShoppingCart color="white" size={24} />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.dark.background,
    },
    header: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.dark.border,
        backgroundColor: Colors.dark.card,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.dark.text,
    },
    subtitle: {
        fontSize: 14,
        color: Colors.dark.textSecondary,
        marginTop: 4,
    },
    listContent: {
        padding: 16,
        paddingBottom: 100, // Space for floating cart
    },
    menuItem: {
        flexDirection: 'row',
        backgroundColor: Colors.dark.card,
        borderRadius: 12,
        marginBottom: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    menuImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        backgroundColor: Colors.dark.border,
    },
    menuContent: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'space-between',
    },
    menuName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.dark.text,
    },
    menuDesc: {
        fontSize: 12,
        color: Colors.dark.textSecondary,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.dark.primary,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.dark.primary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    addButtonText: {
        color: 'white',
        fontWeight: 'bold',
        marginLeft: 4,
        fontSize: 12,
    },
    floatingCartContainer: {
        position: 'absolute',
        bottom: 24,
        left: 16,
        right: 16,
    },
    floatingCart: {
        backgroundColor: Colors.dark.primary,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    cartInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    badge: {
        backgroundColor: 'white',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 2,
        marginRight: 10,
    },
    badgeText: {
        color: Colors.dark.primary,
        fontWeight: 'bold',
        fontSize: 14,
    },
    viewCartText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
