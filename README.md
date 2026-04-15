# Smart Health Companion (SMC)

A full-stack React Native mobile application designed to connect patients with doctors, view specialist profiles, and seamlessly book appointments. Built with an **offline-first** architecture that automatically bridges bad network connections using native device caching.

## 🚀 Technologies Used
- **Frontend**: React Native, React Navigation, Axios, AsyncStorage
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas & Mongoose Schema

## ✨ Features
- **Doctor Browsing**: Browse a detailed list of clinical doctors, complete with specialized descriptions, clinical profiles, and dynamic ratings.
- **Dynamic Scheduling**: Interactive Day and Time slot picker that syncs strictly with the doctor's exact available clinic hours.
- **Offline-First Resilience**: Automatically intercepts network failures and falls back to rendering local SQLite/AsyncStorage caches so the app remains accessible.
- **Appointment Management**: Book, review, and cancel active appointments globally.

---

## 🛠 Local Setup & Installation

### Prerequisites
- Node.js (v18+ recommended)
- Android Studio / Xcode (or a physical device connected via USB)
- A MongoDB Atlas database instance

### 1. Backend Setup (MongoDB & Express)
1. Open a terminal and navigate to the `server/` directory:
   ```bash
   cd server
   npm install
   ```
2. Create a `.env` file in the `/server` directory and add your MongoDB Atlas connection string:
   ```
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/smarthealth?retryWrites=true&w=majority
   ```
3. Seed the database with the initial doctor scheduling data (only required once):
   ```bash
   node seed.js
   ```
4. Start the Express API server:
   ```bash
   node index.js
   ```

### 2. Frontend Setup (React Native)
1. Open a new terminal tab located at the project's root directory:
   ```bash
   npm install
   ```
2. Start the React Native Metro Server:
   ```bash
   npm run start
   ```
3. Build and launch the application onto your Android emulator (or device):
   ```bash
   npx react-native run-android
   ```

> **Note for Physical Devices / USB Testing:**
> If you are testing over a physical Android device, ensure your `src/config.js` is set to `http://localhost:3000/api` and run the following command to securely bridge your phone's network to your desktop's Node.js host:
> ```bash
> adb reverse tcp:3000 tcp:3000
> ```
