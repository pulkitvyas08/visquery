import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, MoveVertical as MoreVertical, Share } from 'lucide-react-native';
import { useImageGallery } from '@/hooks/useImageGallery';
import Animated, { FadeInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const GRID_PADDING = 20;
const GRID_GAP = 8;
const GRID_COLS = 3;
const IMAGE_SIZE = (width - GRID_PADDING * 2 - GRID_GAP * (GRID_COLS - 1)) / GRID_COLS;

export default function AlbumScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { albums, images } = useImageGallery();
  
  const album = albums.find(a => a.id === id);
  const albumImages = images.filter(img => img.albumId === id);

  if (!album) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <Text>Album not found</Text>
        </SafeAreaView>
      </View>
    );
  }

  const handleImagePress = (image: any) => {
    router.push(`/image-viewer/${image.id}`);
  };

  const renderGridItem = ({ item, index }: { item: any; index: number }) => (
    <Animated.View
      entering={FadeInDown.delay(index * 50)}
      style={styles.gridItem}
    >
      <TouchableOpacity 
        style={styles.imageContainer}
        onPress={() => handleImagePress(item)}
      >
        <Image source={{ uri: item.uri }} style={styles.gridImage} />
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color="#212121" strokeWidth={2} />
            </TouchableOpacity>
            <View>
              <Text style={styles.headerTitle}>{album.title}</Text>
              <Text style={styles.headerSubtitle}>
                {albumImages.length} photos
              </Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <Share size={24} color="#757575" strokeWidth={2} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <MoreVertical size={24} color="#757575" strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Album Cover */}
          {album.coverImage && (
            <View style={styles.coverSection}>
              <Image source={{ uri: album.coverImage }} style={styles.coverImage} />
              <View style={styles.coverOverlay}>
                <Text style={styles.coverTitle}>{album.title}</Text>
                <Text style={styles.coverSubtitle}>{albumImages.length} photos</Text>
              </View>
            </View>
          )}

          {/* Images Grid */}
          <View style={styles.gridContainer}>
            <View style={styles.gridWrapper}>
              {albumImages.map((item, index) => (
                <Animated.View
                  key={item.id}
                  entering={FadeInDown.delay(index * 50)}
                  style={styles.gridItem}
                >
                  <TouchableOpacity 
                    style={styles.imageContainer}
                    onPress={() => handleImagePress(item)}
                  >
                    <Image source={{ uri: item.uri }} style={styles.gridImage} />
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    color: '#212121',
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#757575',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  coverSection: {
    height: 200,
    backgroundColor: '#F5F5F5',
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 20,
  },
  coverTitle: {
    fontSize: 24,
    fontFamily: 'Roboto-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  coverSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
  },
  gridContainer: {
    flex: 1,
    padding: GRID_PADDING,
  },
  gridWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: IMAGE_SIZE,
    marginBottom: GRID_GAP,
  },
  imageContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
  },
  gridImage: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
  },
});