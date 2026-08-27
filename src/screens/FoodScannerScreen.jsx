import React, { useState, useContext, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, StatusBar,
  ActivityIndicator, Alert, Dimensions,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DietContext } from '../context/DietContext';
import { COLORS, SHADOWS } from '../theme';

const FoodScannerScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { scanFood, isScanning } = useContext(DietContext);
  const [scanProgress, setScanProgress] = useState(0);
  const [cameraOpening, setCameraOpening] = useState(true);
  const cameraLaunched = useRef(false);

  // Launch camera immediately on mount — no intermediate screen
  useEffect(() => {
    if (!cameraLaunched.current) {
      cameraLaunched.current = true;
      openNativeCamera();
    }
  }, []);

  // Progress animation while scanning
  useEffect(() => {
    if (isScanning) {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 2;
        if (progress >= 92) { clearInterval(interval); progress = 92; }
        setScanProgress(progress);
      }, 100);
      return () => clearInterval(interval);
    } else {
      setScanProgress(0);
    }
  }, [isScanning]);

  const processImage = async (base64Data) => {
    if (!base64Data) {
      Alert.alert('Error', 'No image data received. Please try again.');
      return;
    }
    try {
      const result = await scanFood(base64Data);
      if (result && result.success) {
        navigation.navigate('MealNutritionDetail', { nutrition: result.nutrition, imageBase64: base64Data });
      } else {
        Alert.alert(
          'Unable to Scan Food',
          (result && result.error) || 'Could not analyze the food image. Please try again with a clearer photo.',
          [
            { text: 'Retry Camera', onPress: () => openNativeCamera() },
            { text: 'Pick from Gallery', onPress: () => openGallery() },
            { text: 'Go Back', onPress: () => navigation.goBack(), style: 'cancel' },
          ]
        );
      }
    } catch (e) {
      Alert.alert('Error', 'An unexpected error occurred during scanning.');
    }
  };

  const openNativeCamera = async () => {
    if (isScanning) return;
    setCameraOpening(true);
    try {
      const result = await launchCamera({
        mediaType: 'photo',
        includeBase64: true,
        maxWidth: 1024,
        maxHeight: 1024,
        quality: 0.8,
        cameraType: 'back',
      });

      setCameraOpening(false);

      if (result.didCancel) {
        navigation.goBack();
        return;
      }
      if (result.errorCode) {
        if (result.errorCode === 'camera_unavailable') {
          Alert.alert('Camera Unavailable', 'Your device camera is not available. Try picking from gallery.', [
            { text: 'Open Gallery', onPress: () => openGallery() },
            { text: 'Go Back', onPress: () => navigation.goBack(), style: 'cancel' },
          ]);
        } else if (result.errorCode === 'permission') {
          Alert.alert('Permission Denied', 'Camera permission is required to scan food. Please enable it in your device settings.', [
            { text: 'Go Back', onPress: () => navigation.goBack() },
          ]);
        } else {
          Alert.alert('Camera Error', result.errorMessage || 'Could not open camera.');
        }
        return;
      }
      if (result.assets && result.assets[0] && result.assets[0].base64) {
        await processImage(result.assets[0].base64);
      } else {
        Alert.alert('Error', 'No image captured. Please try again.', [
          { text: 'Retry', onPress: () => openNativeCamera() },
          { text: 'Go Back', onPress: () => navigation.goBack(), style: 'cancel' },
        ]);
      }
    } catch (err) {
      setCameraOpening(false);
      console.error('Camera launch error:', err);
      Alert.alert('Camera Error', 'Could not open camera.', [
        { text: 'Try Gallery', onPress: () => openGallery() },
        { text: 'Go Back', onPress: () => navigation.goBack(), style: 'cancel' },
      ]);
    }
  };

  const openGallery = async () => {
    if (isScanning) return;
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        includeBase64: true,
        maxWidth: 1024,
        maxHeight: 1024,
        quality: 0.8,
      });
      if (result.didCancel) return;
      if (result.assets && result.assets[0] && result.assets[0].base64) {
        await processImage(result.assets[0].base64);
      }
    } catch (err) {
      console.error('Gallery error:', err);
      Alert.alert('Error', 'Could not open gallery.');
    }
  };

  return (
    <View style={[s.container, { paddingTop: Math.max(insets.top, 12) }]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.dietBg} />

      {/* Top Bar */}
      <View style={s.topBar}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Text style={s.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={s.topTitle}>AI Food Scanner</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={s.content}>
        {cameraOpening && !isScanning ? (
          <View style={s.openingContainer}>
            <ActivityIndicator size="large" color={COLORS.dietAccent} />
            <Text style={s.openingText}>Opening Camera...</Text>
          </View>
        ) : isScanning ? (
          <View style={s.scanningContainer}>
            <View style={s.scanningCircle}>
              <ActivityIndicator size="large" color={COLORS.dietAccent} />
            </View>
            <Text style={s.scanningTitle}>Analyzing Your Food...</Text>
            <Text style={s.scanningSubtext}>Our AI is identifying ingredients and calculating nutrition values</Text>

            <View style={s.progressBarBg}>
              <View style={[s.progressBarFill, { width: `${scanProgress}%` }]} />
            </View>
            <Text style={s.progressText}>{scanProgress}% complete</Text>

            <View style={s.tagsRow}>
              {['🔍 Detecting', '🥬 Ingredients', '📏 Portions'].map((t, i) => (
                <View key={i} style={s.tag}><Text style={s.tagText}>{t}</Text></View>
              ))}
            </View>
          </View>
        ) : (
          <View style={s.idleContainer}>
            <Text style={s.idleEmoji}>📸</Text>
            <Text style={s.idleTitle}>Ready to Scan</Text>
            <Text style={s.idleSub}>Take a photo or pick from gallery</Text>

            <TouchableOpacity style={s.cameraBtn} onPress={openNativeCamera} activeOpacity={0.85}>
              <Text style={s.cameraBtnText}>📷  Open Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.galleryBtn} onPress={openGallery} activeOpacity={0.85}>
              <Text style={s.galleryBtnText}>🖼️  Pick from Gallery</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dietBg },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 },
  backBtn: { padding: 8 },
  backText: { color: COLORS.dietAccent, fontSize: 16, fontWeight: '600' },
  topTitle: { fontSize: 17, fontWeight: '700', color: COLORS.dietTextPrimary },
  content: { flex: 1, paddingHorizontal: 24 },

  // Camera Opening
  openingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 60 },
  openingText: { fontSize: 16, fontWeight: '600', color: COLORS.dietTextSecondary, marginTop: 16 },

  // Scanning
  scanningContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 60 },
  scanningCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: COLORS.dietAccentBg, justifyContent: 'center', alignItems: 'center', marginBottom: 24, borderWidth: 3, borderColor: COLORS.dietAccent },
  scanningTitle: { fontSize: 22, fontWeight: '800', color: COLORS.dietTextPrimary, marginBottom: 8 },
  scanningSubtext: { fontSize: 14, color: COLORS.dietTextSecondary, textAlign: 'center', lineHeight: 20, paddingHorizontal: 16, marginBottom: 32 },
  progressBarBg: { width: '80%', height: 8, borderRadius: 4, backgroundColor: '#E2E8F0', marginBottom: 8 },
  progressBarFill: { height: 8, borderRadius: 4, backgroundColor: COLORS.dietAccent },
  progressText: { fontSize: 13, fontWeight: '600', color: COLORS.dietAccent, marginBottom: 24 },
  tagsRow: { flexDirection: 'row', gap: 10 },
  tag: { backgroundColor: COLORS.dietAccentBg, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: COLORS.dietAccent + '44' },
  tagText: { color: COLORS.dietAccentText, fontSize: 12, fontWeight: '600' },

  // Idle / Retry
  idleContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 60 },
  idleEmoji: { fontSize: 56, marginBottom: 12 },
  idleTitle: { fontSize: 24, fontWeight: '800', color: COLORS.dietTextPrimary, marginBottom: 6 },
  idleSub: { fontSize: 14, color: COLORS.dietTextSecondary, marginBottom: 32 },
  cameraBtn: { backgroundColor: COLORS.dietAccent, borderRadius: 14, paddingVertical: 16, width: '100%', alignItems: 'center', marginBottom: 12, ...SHADOWS.button },
  cameraBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  galleryBtn: { backgroundColor: '#FFFFFF', borderRadius: 14, paddingVertical: 16, width: '100%', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  galleryBtnText: { fontSize: 16, fontWeight: '600', color: COLORS.dietTextPrimary },
});

export default FoodScannerScreen;
