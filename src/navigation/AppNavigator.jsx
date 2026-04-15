import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Dashboard from "../screens/Dashboard";
import DoctorList from "../screens/DoctorList";
import DoctorDetails from "../screens/DoctorDetails";
import Appointments from "../screens/Appointments";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#0066cc' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen name="Dashboard" component={Dashboard} options={{ title: 'Home' }} />
      <Stack.Screen name="Doctors" component={DoctorList} options={{ title: 'Find a Doctor' }} />
      <Stack.Screen name="DoctorDetails" component={DoctorDetails} options={{ title: 'Doctor Profile' }} />
      <Stack.Screen name="Appointments" component={Appointments} options={{ title: 'My Appointments' }} />
    </Stack.Navigator>
  );
}