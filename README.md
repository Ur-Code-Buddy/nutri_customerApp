# Nutri Tiffin - Fresh Home-Cooked Meals Delivered 🍱

> **A React Native mobile application connecting food lovers with authentic home kitchens.**

![Expo](https://img.shields.io/badge/Expo-Go-000020?style=for-the-badge&logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

## 📖 About the Project

**Nutri Tiffin** solves the daily dilemma of finding healthy, affordable, and homely food. The app acts as a bridge between busy individuals and passionate home chefs ("Kitchens"). Users can browse kitchens, explore diverse menus, manage their orders, and enjoy seamless food delivery.

Built with **Expo** and **TypeScript**, this project demonstrates modern React Native development practices, including file-based routing with **Expo Router**, secure authentication flows, and persistent local state management.

---

## ✨ Key Features

- **🏠 Kitchen Discovery**: Browse a list of verified home kitchens offering distinct menus. Be it North Indian, South Indian, or Continental - find it all.
- **🛒 Smart Cart Management**:
    - Add/remove items with intuitive quantity controls.
    - **Context-Aware Cart**: Ensures orders are placed from a single kitchen to simplify logistics (prompts user before clearing cart if switching kitchens).
    - **Persistence**: Cart state is saved locally using `expo-secure-store`, so users never lose their selection even if they restart the app.
- **🔐 Secure Authentication**: 
    - Full Login/Register flow.
    - JWT-based authentication with `Axios` interceptors.
    - Token storage in secure hardware-backed storage.
- **📦 Order Tracking**: Create orders seamlessly and track order history in the "My Orders" tab.
- **👤 User Profile**: Manage personal details and account settings.

---

## 🛠️ Technical Architecture & Stack

This project is structured for scalability and maintainability.

### **Core Stack**
- **Framework**: [Expo SDK 52](https://expo.dev/) (Managed Workflow)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict typing for robustness)
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing v3)
- **Networking**: [Axios](https://axios-http.com/) (Centralized API service with interceptors)

### **State Management**
- **React Context API**: Used for global state to avoid prop drilling, specifically for:
    - `AuthContext`: Manages user session, login/logout, and token hydration.
    - `CartContext`: Handles detailed cart logic (add/remove items, total calculation, kitchen validation).

### **Data Persistence**
- **Expo Secure Store**: Used over AsyncStorage for sensitive data (Auth Tokens) and critical user state (Cart contents) to ensure security and reliability.

### **UI/UX**
- **Icons**: `lucide-react-native` for modern, clean iconography.
- **Styling**: `StyleSheet` with a centralized `Colors` constant for theming consistency (Dark/Light mode ready setup).

---

## 📂 Project Structure

```bash
nutri_customerApp/
├── app/                  # Expo Router pages (screens)
│   ├── (auth)/           # Authentication stack (Login/Register)
│   ├── (tabs)/           # Main App Tabs (Kitchens, Orders, Profile)
│   ├── kitchen/[id].tsx  # Dynamic route for Kitchen Details
│   ├── cart.tsx          # Cart Modal Screen
│   └── _layout.tsx       # Root Layout & Providers
├── components/           # Reusable UI components
├── context/              # Global State (Auth, Cart)
├── services/             # API integration (Axios instance, endpoints)
├── constants/            # App-wide constants (Colors, config)
└── assets/               # Images and Fonts
```

---

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites
- **Node.js** (v18 or higher)
- **Expo Go** app installed on your physical device (Android/iOS) or an Emulator.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/nutri-customer-app.git
   cd nutri_customerApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   - The API URL is configured in `services/api.ts`.
   - Update `API_URL` if you are running a local backend server.

4. **Run the app**
   ```bash
   npx expo start
   ```

5. **Scan & Go**
   - Scan the QR code with your phone's camera (iOS) or the Expo Go app (Android).

---

## 🔮 Future Roadmap & Improvements

To demonstrate forward-thinking product development, here are planned enhancements:

- [ ] **Push Notifications**: Integrate Expo Notifications for order status updates.
- [ ] **Real-time Tracking**: utilize Maps API to track delivery partners.
- [ ] **Payment Gateway**: Integrate Razorpay/Stripe for in-app payments.
- [ ] **Review System**: Allow users to rate kitchens and dishes.
- [ ] **Dark Mode Support**: Fully leverage the `Colors` constant for dynamic theme switching.

---

## 🤝 Contributing

Contributions are welcome! If you have suggestions or bug fixes, please fork the repository and create a pull request.

---

**Developed with ❤️ by Your Name**
