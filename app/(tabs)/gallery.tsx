import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Grid3x3 as Grid3X3,
  List,
  Filter,
  Download,
  MoveHorizontal as MoreHorizontal,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useImageGallery } from '@/hooks/useImageGallery';
import { ImageItem } from '@/types';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const GRID_PADDING = 24;
const GRID_GAP = 8;
const GRID_COLS = 3;
const IMAGE_SIZE =
  (width - GRID_PADDING * 2 - GRID_GAP * (GRID_COLS - 1)) / GRID_COLS;

export default function GalleryScreen() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date');
  const [filterTag, setFilterTag] = useState<string | null>(null);

  const { images, loading, refreshImages } = useImageGallery();

  const sortedImages = React.useMemo(() => {
    let filtered = images;

    if (filterTag) {
      filtered = filtered.filter((img) => img.tags.includes(filterTag));
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case 'name':
          return a.fileName.localeCompare(b.fileName);
        case 'size':
          return b.size - a.size;
        default:
          return 0;
      }
    });
  }, [images, sortBy, filterTag]);

  const getAllTags = () => {
    const tagSet = new Set<string>();
    images.forEach((img) => {
      img.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet);
  };

  const renderGridImages = () => {
    const rows = [];
    for (let i = 0; i < sortedImages.length; i += GRID_COLS) {
      const rowImages = sortedImages.slice(i, i + GRID_COLS);
      rows.push(
        <View key={i} style={styles.gridRow}>
          {rowImages.map((item, index) => (
            <Animated.View
              key={item.id}
              entering={FadeInUp.delay((i + index) * 50)}
              style={styles.gridItem}
            >
              <TouchableOpacity style={styles.imageContainer}>
                <Image source={{ uri: item.uri }} style={styles.gridImage} />
                <View style={styles.imageOverlay}>
                  <TouchableOpacity style={styles.moreButton}>
                    <MoreHorizontal size={16} color="#FFFFFF" strokeWidth={2} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
          {/* Fill empty spaces in the last row */}
          {rowImages.length < GRID_COLS &&
            Array.from({ length: GRID_COLS - rowImages.length }).map(
              (_, emptyIndex) => (
                <View
                  key={`empty-${i}-${emptyIndex}`}
                  style={styles.gridItem}
                />
              )
            )}
        </View>
      );
    }
    return rows;
  };

  const renderListImages = () => {
    return sortedImages.map((item, index) => (
      <Animated.View
        key={item.id}
        entering={FadeInDown.delay(index * 50)}
        style={styles.listItem}
      >
        <Image source={{ uri: item.uri }} style={styles.listImage} />
        <View style={styles.listContent}>
          <Text style={styles.listTitle} numberOfLines={1}>
            {item.fileName}
          </Text>
          <Text style={styles.listSubtitle}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
          <Text style={styles.listCaption} numberOfLines={2}>
            {item.caption || 'No caption available'}
          </Text>
          <View style={styles.listTags}>
            {item.tags.slice(0, 3).map((tag, tagIndex) => (
              <View key={tagIndex} style={styles.listTag}>
                <Text style={styles.listTagText}>{tag}</Text>
              </View>
            ))}
            {item.tags.length > 3 && (
              <Text style={styles.listTagMore}>+{item.tags.length - 3}</Text>
            )}
          </View>
        </View>
        <TouchableOpacity style={styles.listMoreButton}>
          <MoreHorizontal size={20} color="#6B7280" strokeWidth={2} />
        </TouchableOpacity>
      </Animated.View>
    ));
  };

  return (
    <LinearGradient colors={['#0F172A', '#1E293B']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
          <View>
            <Text style={styles.title}>Your Gallery</Text>
            <Text style={styles.subtitle}>
              {sortedImages.length} photos •{' '}
              {Math.round(
                sortedImages.reduce((acc, img) => acc + img.size, 0) /
                  (1024 * 1024)
              )}{' '}
              MB
            </Text>
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={[
                styles.headerButton,
                viewMode === 'grid' && styles.headerButtonActive,
              ]}
              onPress={() => setViewMode('grid')}
            >
              <Grid3X3
                size={18}
                color={viewMode === 'grid' ? '#3B82F6' : '#6B7280'}
                strokeWidth={2}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.headerButton,
                viewMode === 'list' && styles.headerButtonActive,
              ]}
              onPress={() => setViewMode('list')}
            >
              <List
                size={18}
                color={viewMode === 'list' ? '#3B82F6' : '#6B7280'}
                strokeWidth={2}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Filter size={18} color="#6B7280" strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Filter Tags */}
        {getAllTags().length > 0 && (
          <Animated.View
            entering={FadeInDown.delay(200)}
            style={styles.filterSection}
          >
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity
                style={[styles.filterTag, !filterTag && styles.filterTagActive]}
                onPress={() => setFilterTag(null)}
              >
                <Text
                  style={[
                    styles.filterTagText,
                    !filterTag && styles.filterTagTextActive,
                  ]}
                >
                  All
                </Text>
              </TouchableOpacity>
              {getAllTags()
                .slice(0, 10)
                .map((tag, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.filterTag,
                      filterTag === tag && styles.filterTagActive,
                    ]}
                    onPress={() => setFilterTag(filterTag === tag ? null : tag)}
                  >
                    <Text
                      style={[
                        styles.filterTagText,
                        filterTag === tag && styles.filterTagTextActive,
                      ]}
                    >
                      {tag}
                    </Text>
                  </TouchableOpacity>
                ))}
            </ScrollView>
          </Animated.View>
        )}

        {/* Gallery */}
        <ScrollView
          style={styles.gallery}
          contentContainerStyle={styles.galleryContent}
          showsVerticalScrollIndicator={false}
        >
          {sortedImages.length === 0 ? (
            <Animated.View
              entering={FadeInDown.delay(300)}
              style={styles.emptyState}
            >
              <Text style={styles.emptyTitle}>No Photos Yet</Text>
              <Text style={styles.emptySubtitle}>
                Take some photos or import from your device to get started
              </Text>
            </Animated.View>
          ) : (
            <View style={styles.imagesContainer}>
              {viewMode === 'grid' ? renderGridImages() : renderListImages()}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'SpaceGrotesk-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    backgroundColor: '#1E293B',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  headerButtonActive: {
    backgroundColor: '#1E40AF',
    borderColor: '#3B82F6',
  },
  filterSection: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  filterTag: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  filterTagActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  filterTagText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
  },
  filterTagTextActive: {
    color: '#FFFFFF',
  },
  gallery: {
    flex: 1,
  },
  galleryContent: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  imagesContainer: {
    flex: 1,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: GRID_GAP,
  },
  gridItem: {
    width: IMAGE_SIZE,
  },
  imageContainer: {
    position: 'relative',
  },
  gridImage: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 12,
  },
  imageOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  moreButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    padding: 4,
  },
  listItem: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  listImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  listContent: {
    flex: 1,
    marginLeft: 12,
  },
  listTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  listSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginBottom: 4,
  },
  listCaption: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#D1D5DB',
    marginBottom: 6,
    lineHeight: 18,
  },
  listTags: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  listTag: {
    backgroundColor: '#334155',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  listTagText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#E2E8F0',
  },
  listTagMore: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
  },
  listMoreButton: {
    padding: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 24,
    fontFamily: 'SpaceGrotesk-SemiBold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 24,
  },
});
