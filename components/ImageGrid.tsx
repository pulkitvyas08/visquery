import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
} from 'react-native';
import { router } from 'expo-router';
import { ImageItem } from '@/types';
import { MoveHorizontal as MoreHorizontal } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const GRID_PADDING = 24;
const GRID_GAP = 8;
const GRID_COLS = 3;
const IMAGE_SIZE = (width - GRID_PADDING * 2 - GRID_GAP * (GRID_COLS - 1)) / GRID_COLS;

interface ImageGridProps {
  images: ImageItem[];
  onImagePress?: (image: ImageItem) => void;
  onImageLongPress?: (image: ImageItem) => void;
}

export function ImageGrid({ images, onImagePress, onImageLongPress }: ImageGridProps) {
  const handleImagePress = (image: ImageItem) => {
    if (onImagePress) {
      onImagePress(image);
    } else {
      router.push(`/image-viewer/${image.id}`);
    }
  };

  if (images.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>No Images Found</Text>
        <Text style={styles.emptySubtitle}>
          Take photos or adjust your search to see images here
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {images.map((image, index) => (
          <Animated.View
            key={image.id}
            entering={FadeInUp.delay(index * 50)}
            style={styles.gridItem}
          >
            <TouchableOpacity
              style={styles.imageContainer}
              onPress={() => handleImagePress(image)}
              onLongPress={() => onImageLongPress?.(image)}
            >
              <Image source={{ uri: image.uri }} style={styles.image} />
              <View style={styles.overlay}>
                <TouchableOpacity style={styles.moreButton}>
                  <MoreHorizontal size={16} color="#FFFFFF" strokeWidth={2} />
                </TouchableOpacity>
              </View>
              {image.tags.length > 0 && (
                <View style={styles.tagOverlay}>
                  <Text style={styles.tagText} numberOfLines={1}>
                    {image.tags[0]}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: GRID_PADDING,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: IMAGE_SIZE,
    marginBottom: GRID_GAP,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 12,
  },
  overlay: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  moreButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    padding: 4,
  },
  tagOverlay: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Inter-Medium',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Roboto-Medium',
    color: '#757575',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#9E9E9E',
    textAlign: 'center',
    lineHeight: 24,
  },
});