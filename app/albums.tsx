import React, { useState } from 'react';
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
import { router } from 'expo-router';
import { ArrowLeft, Grid3x3, List, Plus, Camera } from 'lucide-react-native';
import { useImageGallery } from '@/hooks/useImageGallery';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const GRID_PADDING = 20;
const GRID_GAP = 16;
const GRID_COLS = 2;
const ALBUM_SIZE =
  (width - GRID_PADDING * 2 - GRID_GAP * (GRID_COLS - 1)) / GRID_COLS;

export default function AlbumsScreen() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { albums, images } = useImageGallery();

  const albumsWithCounts = albums.map((album) => ({
    ...album,
    count: images.filter((img) => img.albumId === album.id).length,
  }));

  const renderGridItem = (album: any, index: number) => (
    <Animated.View
      key={album.id}
      entering={FadeInRight.delay(index * 100)}
      style={styles.gridItem}
    >
      <TouchableOpacity
        style={styles.albumContainer}
        onPress={() => router.push(`/album/${album.id}`)}
      >
        <View style={styles.albumCover}>
          {album.coverImage ? (
            <Image
              source={{ uri: album.coverImage }}
              style={styles.albumImage}
            />
          ) : (
            <View style={styles.albumPlaceholder}>
              <Camera size={32} color="#E0E0E0" strokeWidth={1.5} />
            </View>
          )}
          <View style={styles.albumOverlay}>
            <Text style={styles.albumCount}>{album.count}</Text>
          </View>
        </View>
        <Text style={styles.albumTitle} numberOfLines={1}>
          {album.title}
        </Text>
        <Text style={styles.albumSubtitle}>
          {album.count} photo{album.count !== 1 ? 's' : ''}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderListItem = (album: any, index: number) => (
    <Animated.View
      key={album.id}
      entering={FadeInDown.delay(index * 50)}
      style={styles.listItem}
    >
      <TouchableOpacity
        style={styles.listItemContent}
        onPress={() => router.push(`/album/${album.id}`)}
      >
        <View style={styles.listAlbumCover}>
          {album.coverImage ? (
            <Image
              source={{ uri: album.coverImage }}
              style={styles.listAlbumImage}
            />
          ) : (
            <View style={styles.listAlbumPlaceholder}>
              <Camera size={24} color="#E0E0E0" strokeWidth={1.5} />
            </View>
          )}
        </View>
        <View style={styles.listContent}>
          <Text style={styles.listTitle} numberOfLines={1}>
            {album.title}
          </Text>
          <Text style={styles.listSubtitle}>
            {album.count} photo{album.count !== 1 ? 's' : ''}
          </Text>
          <Text style={styles.listDate}>
            Created {new Date(album.createdAt).toLocaleDateString()}
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
            <Text style={styles.headerTitle}>Albums</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={[
                styles.headerButton,
                viewMode === 'grid' && styles.activeButton,
              ]}
              onPress={() => setViewMode('grid')}
            >
              <Grid3x3
                size={24}
                color={viewMode === 'grid' ? '#1976D2' : '#757575'}
                strokeWidth={2}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.headerButton,
                viewMode === 'list' && styles.activeButton,
              ]}
              onPress={() => setViewMode('list')}
            >
              <List
                size={24}
                color={viewMode === 'list' ? '#1976D2' : '#757575'}
                strokeWidth={2}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Plus size={24} color="#1976D2" strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.stats}>
          <Text style={styles.statsText}>
            {albumsWithCounts.length} album
            {albumsWithCounts.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Albums */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {albumsWithCounts.length === 0 ? (
            <Animated.View
              entering={FadeInDown.delay(300)}
              style={styles.emptyState}
            >
              <Camera size={64} color="#E0E0E0" strokeWidth={1.5} />
              <Text style={styles.emptyTitle}>No Albums Yet</Text>
              <Text style={styles.emptySubtitle}>
                Create albums to organize your photos
              </Text>
              <TouchableOpacity style={styles.createButton}>
                <Plus size={20} color="#FFFFFF" strokeWidth={2} />
                <Text style={styles.createButtonText}>Create Album</Text>
              </TouchableOpacity>
            </Animated.View>
          ) : (
            <View style={styles.albumsContainer}>
              {viewMode === 'grid' ? (
                <View style={styles.gridContainer}>
                  {albumsWithCounts.map((album, index) =>
                    renderGridItem(album, index)
                  )}
                </View>
              ) : (
                <View style={styles.listContainer}>
                  {albumsWithCounts.map((album, index) =>
                    renderListItem(album, index)
                  )}
                </View>
              )}
            </View>
          )}

          {/* Bottom Padding */}
          <View style={styles.bottomPadding} />
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
  scrollView: {
    flex: 1,
  },
  albumsContainer: {
    padding: GRID_PADDING,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: ALBUM_SIZE,
    marginBottom: GRID_GAP,
  },
  albumContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  albumCover: {
    width: ALBUM_SIZE,
    height: ALBUM_SIZE,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
    position: 'relative',
  },
  albumImage: {
    width: '100%',
    height: '100%',
  },
  albumPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  albumOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  albumCount: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  albumTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#212121',
    marginTop: 8,
    marginBottom: 2,
  },
  albumSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#757575',
  },
  listContainer: {
    gap: 12,
  },
  listItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  listItemContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  listAlbumCover: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
  },
  listAlbumImage: {
    width: '100%',
    height: '100%',
  },
  listAlbumPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  listSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#757575',
    marginBottom: 2,
  },
  listDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9E9E9E',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontFamily: 'Roboto-Medium',
    color: '#757575',
    marginTop: 24,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#9E9E9E',
    textAlign: 'center',
    marginBottom: 32,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1976D2',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  createButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  bottomPadding: {
    height: 50,
  },
});
