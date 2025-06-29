import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import {
  Camera,
  RotateCcw,
  Slash as Flash,
  FlashlightOff as FlashOff,
  Image,
  X,
  Download,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useImageProcessor } from '@/hooks/useImageProcessor';
import Animated, {
  FadeInDown,
  FadeInUp,
  SlideInLeft,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [flashMode, setFlashMode] = useState<'off' | 'on'>('off');
  const [permission, requestPermission] = useCameraPermissions();
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  const { processImage } = useImageProcessor();

  if (!permission) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Loading camera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <LinearGradient colors={['#0F172A', '#1E293B']} style={styles.container}>
        <SafeAreaView style={styles.permissionContainer}>
          <Animated.View
            entering={FadeInUp.delay(100)}
            style={styles.permissionContent}
          >
            <Camera size={64} color="#3B82F6" strokeWidth={1.5} />
            <Text style={styles.permissionTitle}>Camera Access Required</Text>
            <Text style={styles.permissionDescription}>
              We need access to your camera to take photos and add them to your
              AI-powered gallery.
            </Text>
            <TouchableOpacity
              style={styles.permissionButton}
              onPress={requestPermission}
            >
              <Text style={styles.permissionButtonText}>Grant Permission</Text>
            </TouchableOpacity>
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlashMode((current) => (current === 'off' ? 'on' : 'off'));
  };

  const takePicture = async () => {
    if (!cameraRef.current) return;

    try {
      setIsProcessing(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });

      if (photo) {
        // Process the image with AI
        await processImage(photo.uri);

        if (Platform.OS !== 'web') {
          // Show haptic feedback on native platforms
          const { impactAsync, ImpactFeedbackStyle } = await import(
            'expo-haptics'
          );
          impactAsync(ImpactFeedbackStyle.Medium);
        }
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to take picture. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images' as any,
        allowsEditing: false,
        quality: 0.8,
        allowsMultipleSelection: true,
      });

      if (!result.canceled && result.assets) {
        setIsProcessing(true);

        // Process all selected images
        for (const asset of result.assets) {
          await processImage(asset.uri);
        }

        Alert.alert(
          'Success',
          `Added ${result.assets.length} photo${
            result.assets.length > 1 ? 's' : ''
          } to your gallery`
        );
      }
    } catch (error) {
      console.error('Error picking images:', error);
      Alert.alert('Error', 'Failed to import images. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        flash={flashMode}
      />

      {/* Top Controls */}
      <SafeAreaView style={styles.topControls}>
        <Animated.View
          entering={SlideInLeft.delay(100)}
          style={styles.topControlsContainer}
        >
          <TouchableOpacity style={styles.controlButton} onPress={toggleFlash}>
            {flashMode === 'off' ? (
              <FlashOff size={24} color="#FFFFFF" strokeWidth={2} />
            ) : (
              <Flash size={24} color="#FFBB33" strokeWidth={2} />
            )}
          </TouchableOpacity>

          <View style={styles.processingIndicator}>
            {isProcessing && (
              <Animated.View
                entering={FadeInDown}
                style={styles.processingBadge}
              >
                <Text style={styles.processingText}>Processing with AI...</Text>
              </Animated.View>
            )}
          </View>
        </Animated.View>
      </SafeAreaView>

      {/* Bottom Controls */}
      <Animated.View
        entering={FadeInUp.delay(200)}
        style={styles.bottomControls}
      >
        <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
          <Image size={28} color="#FFFFFF" strokeWidth={2} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.captureButton,
            isProcessing && styles.captureButtonDisabled,
          ]}
          onPress={takePicture}
          disabled={isProcessing}
        >
          <View style={styles.captureButtonInner}>
            {isProcessing ? (
              <View style={styles.processingDot} />
            ) : (
              <Camera size={32} color="#000000" strokeWidth={2} />
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.flipButton}
          onPress={toggleCameraFacing}
        >
          <RotateCcw size={28} color="#FFFFFF" strokeWidth={2} />
        </TouchableOpacity>
      </Animated.View>

      {/* Camera Guides */}
      <View style={styles.cameraGuides}>
        <View style={styles.guideLine} />
        <View style={[styles.guideLine, styles.guideLineHorizontal]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  permissionContent: {
    alignItems: 'center',
    maxWidth: 300,
  },
  permissionTitle: {
    fontSize: 24,
    fontFamily: 'SpaceGrotesk-Bold',
    color: '#FFFFFF',
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  permissionDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  permissionButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
  },
  permissionButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  permissionText: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
  },
  topControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  topControlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  controlButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    padding: 12,
    backdropFilter: 'blur(10px)',
  },
  processingIndicator: {
    flex: 1,
    alignItems: 'center',
  },
  processingBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backdropFilter: 'blur(10px)',
  },
  processingText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingBottom: 120,
  },
  galleryButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 16,
    padding: 16,
    backdropFilter: 'blur(10px)',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  captureButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#3B82F6',
  },
  flipButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 16,
    padding: 16,
    backdropFilter: 'blur(10px)',
  },
  cameraGuides: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  guideLine: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    width: 1,
    height: '66%',
  },
  guideLineHorizontal: {
    width: '66%',
    height: 1,
  },
});
