import React, { useContext } from "react";
import { ActivityIndicator, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext } from "../context/AuthContext";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import DietDashboardScreen from "../screens/DietDashboardScreen";
import FoodScannerScreen from "../screens/FoodScannerScreen";
import MealNutritionDetailScreen from "../screens/MealNutritionDetailScreen";
import MealHistoryScreen from "../screens/MealHistoryScreen";
import { COLORS } from "../theme";

const Stack = createNativeStackNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: COLORS.dietBg } }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

const AppStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: COLORS.dietBg },
    }}
  >
    <Stack.Screen name="DietDashboard" component={DietDashboardScreen} />
    <Stack.Screen name="FoodScanner" component={FoodScannerScreen} options={{ animation: 'slide_from_bottom' }} />
    <Stack.Screen name="MealNutritionDetail" component={MealNutritionDetailScreen} />
    <Stack.Screen name="MealHistory" component={MealHistoryScreen} options={{ animation: 'slide_from_right' }} />
  </Stack.Navigator>
);

export default function AppNavigator() {
  const { isAuthenticated, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.dietBg }}>
        <ActivityIndicator size="large" color={COLORS.dietAccent} />
      </View>
    );
  }

  return isAuthenticated ? <AppStack /> : <AuthStack />;
}