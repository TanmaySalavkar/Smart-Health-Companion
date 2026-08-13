import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Dashboard from "../screens/Dashboard";
import DoctorList from "../screens/DoctorList";
import DoctorDetails from "../screens/DoctorDetails";
import Appointments from "../screens/Appointments";
import { COLORS, FONTS } from "../theme";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { 
          backgroundColor: COLORS.gradientStart,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: COLORS.textPrimary,
        headerTitleStyle: { 
          fontWeight: '600',
          fontSize: 18,
        },
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: COLORS.bgFallback,
        },
      }}
    >
      <Stack.Screen 
        name="Dashboard" 
        component={Dashboard} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Doctors" 
        component={DoctorList} 
        options={{ title: 'Find a Doctor' }} 
      />
      <Stack.Screen 
        name="DoctorDetails" 
        component={DoctorDetails} 
        options={{ title: 'Doctor Profile' }} 
      />
      <Stack.Screen 
        name="Appointments" 
        component={Appointments} 
        options={{ title: 'My Appointments' }} 
      />
    </Stack.Navigator>
  );
}