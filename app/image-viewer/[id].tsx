import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Share,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Share as ShareIcon, Download, Heart, MoveVertical as MoreVertical, Info, CreditCard as Edit3, Trash2, Tag } from 'lucide-react-native';
import { useImageGallery } from '@/hooks/useImageGallery';
import Animated, { 
  FadeInDown, 
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS
} from 'react-native-reanimated';
import { Image } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function ImageViewerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { images, removeImage } = useImageGallery();
  const [showControls, setShowControls] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  
  // Move all hooks to the top level, before any conditional returns
  const controlsOpacity = useSharedValue(1);
  const infoTranslateY = useSharedValue(height);
  
  const controlsStyle = useAnimatedStyle(() => ({
    opacity: controlsOpacity.value,
  }));

  const infoStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: infoTranslateY.value }],
  }));
  
  const image = images.find(img => img.id === id);

  if (!image) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <Text>Image not found</Text>
        </SafeAreaView>
      </View>
    );
  }

  const toggleControls = () => {
    const newShowControls = !showControls;
    setShowControls(newShowControls);
    controlsOpacity.value = withTiming(newShowControls ? 1 : 0, { duration: 300 });
  };

  const toggleInfo = () => {
    const newShowInfo = !showInfo;
    setShowInfo(newShowInfo);
    infoTranslateY.value = withTiming(newShowInfo ? 0 : height, { duration: 300 });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this photo: ${image.caption || image.fileName}`,
        url: image.uri,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Photo',
      'Are you sure you want to delete this photo? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            await removeImage(image.id);
            router.back();
          }
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      
      {/* Main Image */}
      <TouchableOpacity 
        style={styles.imageContainer} 
        activeOpacity={1}
        onPress={toggleControls}
      >
        <Image 
          source={{ uri: image.uri }} 
          style={styles.image}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* Top Controls */}
      <Animated.View style={[styles.topControls, controlsStyle]}>
        <SafeAreaView style={styles.topSafeArea}>
          <View style={styles.topBar}>
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color="#FFFFFF" strokeWidth={2} />
            </TouchableOpacity>
            
            <View style={styles.topActions}>
              <TouchableOpacity 
                style={styles.controlButton}
                onPress={handleShare}
              >
                <ShareIcon size={24} color="#FFFFFF" strokeWidth={2} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.controlButton}
                onPress={toggleInfo}
              >
                <Info size={24} color="#FFFFFF" strokeWidth={2} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlButton}>
                <MoreVertical size={24} color="#FFFFFF" strokeWidth={2} />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Animated.View>

      {/* Bottom Controls */}
      <Animated.View style={[styles.bottomControls, controlsStyle]}>
        <SafeAreaView style={styles.bottomSafeArea}>
          <View style={styles.bottomBar}>
            <TouchableOpacity 
              style={[styles.actionButton, isLiked && styles.likedButton]}
              onPress={() => setIsLiked(!isLiked)}
            >
              <Heart 
                size={24} 
                color={isLiked ? "#FF4444" : "#FFFFFF"} 
                strokeWidth={2}
                fill={isLiked ? "#FF4444" : "none"}
              />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Download size={24} color="#FFFFFF" strokeWidth={2} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Edit3 size={24} color="#FFFFFF" strokeWidth={2} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleDelete}
            >
              <Trash2 size={24} color="#FF4444" strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Animated.View>

      {/* Info Panel */}
      <Animated.View style={[styles.infoPanel, infoStyle]}>
        <View style={styles.infoPanelHandle} />
        <ScrollView style={styles.infoContent} showsVerticalScrollIndicator={false}>
          <View style={styles.infoHeader}>
            <Text style={styles.infoTitle}>Photo Details</Text>
            <TouchableOpacity onPress={toggleInfo}>
              <ArrowLeft size={24} color="#212121" strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {/* Basic Info */}
          <View style={styles.infoSection}>
            <Text style={styles.infoSectionTitle}>Basic Information</Text>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>File Name</Text>
              <Text style={styles.infoValue}>{image.fileName}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Date Created</Text>
              <Text style={styles.infoValue}>
                {new Date(image.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Size</Text>
              <Text style={styles.infoValue}>
                {Math.round(image.size / (1024 * 1024) * 100) / 100} MB
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Dimensions</Text>
              <Text style={styles.infoValue}>{image.width} × {image.height}</Text>
            </View>
          </View>

          {/* Caption */}
          {image.caption && (
            <View style={styles.infoSection}>
              <Text style={styles.infoSectionTitle}>AI Caption</Text>
              <Text style={styles.captionText}>{image.caption}</Text>
            </View>
          )}

          {/* Tags */}
          {image.tags.length > 0 && (
            <View style={styles.infoSection}>
              <Text style={styles.infoSectionTitle}>Tags</Text>
              <View style={styles.tagsContainer}>
                {image.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Tag size={12} color="#1976D2" strokeWidth={2} />
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Metadata */}
          {image.metadata && (
            <View style={styles.infoSection}>
              <Text style={styles.infoSectionTitle}>AI Analysis</Text>
              {image.metadata.objects && image.metadata.objects.length > 0 && (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Objects Detected</Text>
                  <Text style={styles.infoValue}>
                    {image.metadata.objects.join(', ')}
                  </Text>
                </View>
              )}
              {image.metadata.colors && image.metadata.colors.length > 0 && (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Dominant Colors</Text>
                  <View style={styles.colorsContainer}>
                    {image.metadata.colors.map((color, index) => (
                      <View key={index} style={styles.colorChip}>
                        <Text style={styles.colorText}>{color}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
              {image.metadata.mood && (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Mood</Text>
                  <Text style={styles.infoValue}>{image.metadata.mood}</Text>
                </View>
              )}
              {image.metadata.scene && (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Scene</Text>
                  <Text style={styles.infoValue}>{image.metadata.scene}</Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width,
    height: height,
  },
  topControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  topSafeArea: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  topActions: {
    flexDirection: 'row',
    gap: 8,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  bottomSafeArea: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 20,
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  likedButton: {
    backgroundColor: 'rgba(255, 68, 68, 0.2)',
  },
  infoPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.8,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 2,
  },
  infoPanelHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  infoContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 24,
    fontFamily: 'Roboto-Bold',
    color: '#212121',
  },
  infoSection: {
    marginBottom: 24,
  },
  infoSectionTitle: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    color: '#212121',
    marginBottom: 12,
  },
  infoItem: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#757575',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#212121',
  },
  captionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#212121',
    lineHeight: 24,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  tagText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1976D2',
  },
  colorsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  colorChip: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  colorText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#212121',
    textTransform: 'capitalize',
  },
});