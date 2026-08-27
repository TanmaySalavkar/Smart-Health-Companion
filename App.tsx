import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigation/AppNavigator";
import { AppProvider } from "./src/context/AppContext";
import { AuthProvider } from "./src/context/AuthContext";
import { DietProvider } from "./src/context/DietContext";

export default function App() {
  return (
    <AuthProvider>
      <DietProvider>
        <AppProvider>
          <NavigationContainer>
            <AppNavigator/>
          </NavigationContainer>
        </AppProvider>
      </DietProvider>
    </AuthProvider>
  );
}