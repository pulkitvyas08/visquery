import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Grid3x3, List, Filter, Search } from 'lucide-react-native';
import { useImageGallery } from '@/hooks/useImageGallery';
import Animated, { FadeInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const GRID_PADDING = 20;
const GRID_GAP = 8;
const GRID_COLS = 3;
const IMAGE_SIZE = (width - GRID_PADDING * 2 - GRID_GAP * (GRID_COLS - 1)) / GRID_COLS;

export default function AllImagesScreen() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');
  
  const { images } = useImageGallery();

  const sortedImages = images.sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return a.fileName.localeCompare(b.fileName);
  });

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

  const renderListItem = ({ item, index }: { item: any; index: number }) => (
    <Animated.View
      entering={FadeInDown.delay(index * 50)}
      style={styles.listItem}
    >
      <TouchableOpacity 
        style={styles.listItemContent}
        onPress={() => handleImagePress(item)}
      >
        <Image source={{ uri: item.uri }} style={styles.listImage} />
        <View style={styles.listContent}>
          <Text style={styles.listTitle} numberOfLines={1}>
            {item.fileName}
          </Text>
          <Text style={styles.listDate}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
          <Text style={styles.listCaption} numberOfLines={2}>
            {item.caption || 'No caption available'}
          </Text>
        </View>
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
            <Text style={styles.headerTitle}>All Photos</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <Search size={24} color="#757575" strokeWidth={2} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.headerButton, viewMode === 'grid' && styles.activeButton]}
              onPress={() => setViewMode('grid')}
            >
              <Grid3x3 size={24} color={viewMode === 'grid' ? '#1976D2' : '#757575'} strokeWidth={2} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.headerButton, viewMode === 'list' && styles.activeButton]}
              onPress={() => setViewMode('list')}
            >
              <List size={24} color={viewMode === 'list' ? '#1976D2' : '#757575'} strokeWidth={2} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Filter size={24} color="#757575" strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.stats}>
          <Text style={styles.statsText}>
            {sortedImages.length} photos
          </Text>
        </View>

        {/* Images */}
        <FlatList
          data={sortedImages}
          renderItem={viewMode === 'grid' ? renderGridItem : renderListItem}
          key={viewMode}
          numColumns={viewMode === 'grid' ? GRID_COLS : 1}
          contentContainerStyle={styles.flatListContent}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={viewMode === 'grid' ? styles.gridRow : undefined}
        />
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
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    color: '#212121',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerButton: {
    padding: 8,
    borderRadius: 8,
  },
  activeButton: {
    backgroundColor: '#E3F2FD',
  },
  stats: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  statsText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#757575',
  },
  flatListContent: {
    padding: GRID_PADDING,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: GRID_GAP,
  },
  gridItem: {
    width: IMAGE_SIZE,
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
  listItem: {
    marginBottom: 12,
  },
  listItemContent: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  listImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  listContent: {
    flex: 1,
    marginLeft: 16,
  },
  listTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#212121',
    marginBottom: 4,
  },
  listDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#757575',
    marginBottom: 4,
  },
  listCaption: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#424242',
    lineHeight: 18,
  },
});