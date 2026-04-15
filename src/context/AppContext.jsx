import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState({ name: "User" });
  const [appointments, setAppointments] = useState([]);

  // Load appointments from AsyncStorage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedAppointments = await AsyncStorage.getItem('@appointments');
        if (storedAppointments) {
          setAppointments(JSON.parse(storedAppointments));
        }
      } catch (e) {
        console.error("Failed to load appointments from storage", e);
      }
    };
    loadData();
  }, []);

  // Book an appointment Function
  const bookAppointment = async (doctor, selectedDay, selectedTime) => {
    try {
      const newAppointment = {
        id: Date.now().toString(), // unique ID
        doctor,
        day: selectedDay,
        time: selectedTime,
        dateBooked: new Date().toISOString(), // Record of when it was booked
      };
      const updatedAppointments = [...appointments, newAppointment];
      
      setAppointments(updatedAppointments);
      await AsyncStorage.setItem('@appointments', JSON.stringify(updatedAppointments));
      return true;
    } catch (e) {
      console.error("Failed to save appointment", e);
      return false;
    }
  };

  return (
    <AppContext.Provider value={{ user, appointments, bookAppointment }}>
      {children}
    </AppContext.Provider>
  );
};
