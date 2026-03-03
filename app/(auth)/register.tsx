import { useRouter } from 'expo-router';
import { Lock, Mail, MapPin, Phone, User } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../context/AuthContext';

const INPUT_ICON_PROPS = { color: Colors.dark.textSecondary, size: 20 };

export default function RegisterScreen() {
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [pincode, setPincode] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { signUp, setPendingCredentials } = useAuth();
    const router = useRouter();

    const handleRegister = async () => {
        const fields = [
            { value: username, label: 'Username' },
            { value: name, label: 'Name' },
            { value: email, label: 'Email' },
            { value: phoneNumber, label: 'Phone number' },
            { value: address, label: 'Address' },
            { value: pincode, label: 'Pincode' },
            { value: password, label: 'Password' },
        ];
        const missing = fields.find((f) => !f.value?.trim());
        if (missing) {
            Alert.alert('Error', `Please fill in ${missing.label}`);
            return;
        }

        if (!/^\d{10}$/.test(phoneNumber.trim())) {
            Alert.alert('Error', 'Phone number must be exactly 10 digits');
            return;
        }
        if (!/^\d{6}$/.test(pincode.trim())) {
            Alert.alert('Error', 'Pincode must be exactly 6 digits');
            return;
        }

        setLoading(true);
        try {
            const result = await signUp({
                username: username.trim(),
                name: name.trim(),
                email: email.trim().toLowerCase(),
                phone_number: phoneNumber.trim(),
                address: address.trim(),
                pincode: pincode.trim(),
                password,
            });

            if (result?.needsLogin) {
                setPendingCredentials({ username: username.trim(), password });
                router.replace({
                    pathname: '/(auth)/email-verification-pending',
                    params: { email: result.email },
                });
            }
        } catch (error: any) {
            Alert.alert(
                'Registration Failed',
                error.response?.data?.message || 'Could not create account'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Join NutriTiffin for delicious meals</Text>
                </View>

                <View style={styles.form}>
                    <InputRow icon={<User {...INPUT_ICON_PROPS} />}>
                        <TextInput
                            style={styles.input}
                            placeholder="Username"
                            placeholderTextColor={Colors.dark.textSecondary}
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                        />
                    </InputRow>
                    <InputRow icon={<User {...INPUT_ICON_PROPS} />}>
                        <TextInput
                            style={styles.input}
                            placeholder="Full Name"
                            placeholderTextColor={Colors.dark.textSecondary}
                            value={name}
                            onChangeText={setName}
                        />
                    </InputRow>
                    <InputRow icon={<Mail {...INPUT_ICON_PROPS} />}>
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            placeholderTextColor={Colors.dark.textSecondary}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </InputRow>
                    <InputRow icon={<Phone {...INPUT_ICON_PROPS} />}>
                        <TextInput
                            style={styles.input}
                            placeholder="Phone Number (10 digits)"
                            placeholderTextColor={Colors.dark.textSecondary}
                            value={phoneNumber}
                            onChangeText={(t) => setPhoneNumber(t.replace(/\D/g, '').slice(0, 10))}
                            keyboardType="phone-pad"
                            maxLength={10}
                        />
                    </InputRow>
                    <InputRow icon={<MapPin {...INPUT_ICON_PROPS} />}>
                        <TextInput
                            style={styles.input}
                            placeholder="Address"
                            placeholderTextColor={Colors.dark.textSecondary}
                            value={address}
                            onChangeText={setAddress}
                        />
                    </InputRow>
                    <InputRow icon={<MapPin {...INPUT_ICON_PROPS} />}>
                        <TextInput
                            style={styles.input}
                            placeholder="Pincode (6 digits)"
                            placeholderTextColor={Colors.dark.textSecondary}
                            value={pincode}
                            onChangeText={(t) => setPincode(t.replace(/\D/g, '').slice(0, 6))}
                            keyboardType="number-pad"
                            maxLength={6}
                        />
                    </InputRow>
                    <InputRow icon={<Lock {...INPUT_ICON_PROPS} />}>
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor={Colors.dark.textSecondary}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </InputRow>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleRegister}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color={Colors.dark.primaryForeground} />
                        ) : (
                            <Text style={styles.buttonText}>Sign Up</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                            <Text style={styles.linkText}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

function InputRow({
    icon,
    children,
}: {
    icon: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <View style={styles.inputContainer}>
            <View style={styles.icon}>{icon}</View>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingVertical: 24,
        paddingBottom: 40,
    },
    header: {
        marginBottom: 32,
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.dark.text,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.dark.textSecondary,
    },
    form: {
        width: '100%',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.dark.card,
        borderRadius: 12,
        marginBottom: 12,
        paddingHorizontal: 16,
        height: 52,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    icon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        color: Colors.dark.text,
        fontSize: 16,
    },
    button: {
        backgroundColor: Colors.dark.primary,
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonText: {
        color: Colors.dark.primaryForeground,
        fontSize: 18,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    footerText: {
        color: Colors.dark.textSecondary,
        fontSize: 14,
    },
    linkText: {
        color: Colors.dark.primary,
        fontSize: 14,
        fontWeight: 'bold',
    },
});
