import { Platform } from 'react-native';

// On Android emulator, '10.0.2.2' points to the host computer's localhost.
// On iOS simulator or physical device with 'adb reverse tcp:3000 tcp:3000', 'localhost' is used.
export const API_URL = Platform.OS === 'android' 
  ? 'http://10.0.2.2:3000/api' 
  : 'http://localhost:3000/api';

