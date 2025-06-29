import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  TextInput,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  Search,
  User,
  Camera,
  Settings,
  Clock,
  TrendingUp,
  ChevronRight,
  Plus,
  X,
} from 'lucide-react-native';
import { useImageGallery } from '@/hooks/useImageGallery';
import { useImageSearch } from '@/hooks/useImageSearch';
import { useMediaLibrary } from '@/hooks/useMediaLibrary';
import Animated, {
  FadeInDown,
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  withTiming,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const GRID_PADDING = 20;
const GRID_GAP = 12;
const GRID_COLS = 3;
const IMAGE_SIZE =
  (width - GRID_PADDING * 2 - GRID_GAP * (GRID_COLS - 1)) / GRID_COLS;

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchButton, setShowSearchButton] = useState(false);
  const scrollY = useSharedValue(0);
  const searchButtonScale = useSharedValue(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const searchInputRef = useRef<TextInput>(null);

  const { images, albums, loading, mergeMediaAssets } = useImageGallery();
  const { searchImages, recentSearches, suggestedSearches } = useImageSearch();
  const {
    requestPermissions,
    hasPermissions,
    mediaAssets,
    albums: mediaAlbums,
  } = useMediaLibrary();

  useEffect(() => {
    requestPermissions();
  }, []);

  // Merge media assets when they become available
  useEffect(() => {
    if (hasPermissions && mediaAssets.length > 0) {
      console.log(
        `Merging ${mediaAssets.length} media assets and ${mediaAlbums.length} albums`
      );
      mergeMediaAssets(mediaAssets, mediaAlbums);
    }
  }, [hasPermissions, mediaAssets, mediaAlbums, mergeMediaAssets]);

  const recentImages = images.slice(0, 6);
  const featuredAlbums = albums.slice(0, 4);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchImages(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    searchInputRef.current?.blur();
  };

  const handleImagePress = (image: any) => {
    router.push(`/image-viewer/${image.id}`);
  };

  const searchButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: searchButtonScale.value }],
      opacity: searchButtonScale.value,
    };
  });

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    scrollY.value = offsetY;

    const shouldShow = offsetY > 250;
    if (shouldShow !== showSearchButton) {
      setShowSearchButton(shouldShow);
      searchButtonScale.value = withTiming(shouldShow ? 1 : 0, {
        duration: 300,
      });
    }
  };

  const handleFloatingSearchPress = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 300);
  };

  const renderSearchResults = () => {
    if (searchResults.length === 0) return null;

    return (
      <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Search Results ({searchResults.length})
          </Text>
          <TouchableOpacity onPress={handleClearSearch}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.imageGrid}>
          {searchResults.slice(0, 6).map((result, index) => (
            <Animated.View
              key={result.item.id}
              entering={FadeInRight.delay(index * 100)}
              style={styles.imageItem}
            >
              <TouchableOpacity
                style={styles.imageContainer}
                onPress={() => handleImagePress(result.item)}
              >
                <Image source={{ uri: result.item.uri }} style={styles.image} />
                <View style={styles.searchResultOverlay}>
                  <Text style={styles.matchScore}>
                    {Math.round(result.score * 100)}%
                  </Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Gallery</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => router.push('/camera')}
            >
              <Camera size={24} color="#1976D2" strokeWidth={2} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => router.push('/settings')}
            >
              <Settings size={24} color="#1976D2" strokeWidth={2} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => router.push('/profile')}
            >
              <User size={24} color="#FFFFFF" strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {/* Search Section */}
          <Animated.View
            entering={FadeInDown.delay(100)}
            style={styles.searchSection}
          >
            <View style={styles.searchContainer}>
              <View style={styles.searchBar}>
                <Search size={20} color="#757575" strokeWidth={2} />
                <TextInput
                  ref={searchInputRef}
                  style={styles.searchInput}
                  placeholder="Search your photos with AI..."
                  placeholderTextColor="#9E9E9E"
                  value={searchQuery}
                  onChangeText={(text) => {
                    setSearchQuery(text);
                    handleSearch(text);
                  }}
                  returnKeyType="search"
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={handleClearSearch}>
                    <X size={20} color="#757575" strokeWidth={2} />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Show search suggestions only when not searching */}
            {searchQuery.length === 0 && (
              <>
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <View style={styles.searchSuggestions}>
                    <View style={styles.suggestionHeader}>
                      <Clock size={16} color="#757575" strokeWidth={2} />
                      <Text style={styles.suggestionTitle}>Recent</Text>
                    </View>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                    >
                      <View style={styles.suggestionTags}>
                        {recentSearches.slice(0, 5).map((search, index) => (
                          <TouchableOpacity
                            key={index}
                            style={styles.suggestionTag}
                            onPress={() => {
                              setSearchQuery(search);
                              handleSearch(search);
                            }}
                          >
                            <Text style={styles.suggestionTagText}>
                              {search}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </ScrollView>
                  </View>
                )}

                {/* Try Searching For */}
                <View style={styles.searchSuggestions}>
                  <View style={styles.suggestionHeader}>
                    <TrendingUp size={16} color="#757575" strokeWidth={2} />
                    <Text style={styles.suggestionTitle}>
                      Try searching for
                    </Text>
                  </View>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.suggestionTags}>
                      {suggestedSearches.map((suggestion, index) => (
                        <TouchableOpacity
                          key={index}
                          style={[styles.suggestionTag, styles.trendingTag]}
                          onPress={() => {
                            setSearchQuery(suggestion);
                            handleSearch(suggestion);
                          }}
                        >
                          <Text
                            style={[
                              styles.suggestionTagText,
                              styles.trendingTagText,
                            ]}
                          >
                            {suggestion}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                </View>
              </>
            )}
          </Animated.View>

          {/* Search Results */}
          {searchQuery.length > 0 ? (
            renderSearchResults()
          ) : (
            <>
              {/* Recent Photos */}
              <Animated.View
                entering={FadeInDown.delay(200)}
                style={styles.section}
              >
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Recent Photos</Text>
                  <TouchableOpacity
                    style={styles.seeAllButton}
                    onPress={() => router.push('/all-images')}
                  >
                    <Text style={styles.seeAllText}>See all</Text>
                    <ChevronRight size={16} color="#1976D2" strokeWidth={2} />
                  </TouchableOpacity>
                </View>

                {recentImages.length > 0 ? (
                  <View style={styles.imageGrid}>
                    {recentImages.map((image, index) => (
                      <Animated.View
                        key={image.id}
                        entering={FadeInRight.delay(index * 100)}
                        style={styles.imageItem}
                      >
                        <TouchableOpacity
                          style={styles.imageContainer}
                          onPress={() => handleImagePress(image)}
                        >
                          <Image
                            source={{ uri: image.uri }}
                            style={styles.image}
                          />
                        </TouchableOpacity>
                      </Animated.View>
                    ))}
                  </View>
                ) : (
                  <View style={styles.emptyState}>
                    <Camera size={48} color="#E0E0E0" strokeWidth={1.5} />
                    <Text style={styles.emptyTitle}>No photos yet</Text>
                    <Text style={styles.emptySubtitle}>
                      {!hasPermissions
                        ? 'Grant media access to see your photos'
                        : 'Take some photos to get started'}
                    </Text>
                    <TouchableOpacity
                      style={styles.emptyButton}
                      onPress={() => router.push('/camera')}
                    >
                      <Plus size={20} color="#FFFFFF" strokeWidth={2} />
                      <Text style={styles.emptyButtonText}>Take Photo</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </Animated.View>

              {/* Albums */}
              <Animated.View
                entering={FadeInDown.delay(300)}
                style={styles.section}
              >
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Albums</Text>
                  <TouchableOpacity
                    style={styles.seeAllButton}
                    onPress={() => router.push('/albums')}
                  >
                    <Text style={styles.seeAllText}>See all</Text>
                    <ChevronRight size={16} color="#1976D2" strokeWidth={2} />
                  </TouchableOpacity>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.albumsContainer}>
                    {featuredAlbums.map((album, index) => (
                      <Animated.View
                        key={album.id}
                        entering={FadeInRight.delay(index * 100)}
                        style={styles.albumCard}
                      >
                        <TouchableOpacity
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
                                <Camera
                                  size={32}
                                  color="#E0E0E0"
                                  strokeWidth={1.5}
                                />
                              </View>
                            )}
                          </View>
                          <Text style={styles.albumTitle} numberOfLines={1}>
                            {album.title}
                          </Text>
                          <Text style={styles.albumCount}>
                            {album.count} photos
                          </Text>
                        </TouchableOpacity>
                      </Animated.View>
                    ))}
                  </View>
                </ScrollView>
              </Animated.View>
            </>
          )}

          {/* Bottom Padding */}
          <View style={styles.bottomPadding} />
        </ScrollView>

        {/* Floating Search Button */}
        <Animated.View style={[styles.floatingSearchButton, searchButtonStyle]}>
          <TouchableOpacity
            style={styles.floatingButton}
            onPress={handleFloatingSearchPress}
          >
            <Search size={20} color="#FFFFFF" strokeWidth={2} />
          </TouchableOpacity>
        </Animated.View>
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
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Roboto-Bold',
    color: '#212121',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerButton: {
    padding: 8,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1976D2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  searchSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#212121',
  },
  searchSuggestions: {
    marginBottom: 16,
  },
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  suggestionTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#757575',
  },
  suggestionTags: {
    flexDirection: 'row',
    gap: 8,
  },
  suggestionTag: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  trendingTag: {
    backgroundColor: '#E3F2FD',
  },
  suggestionTagText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#757575',
  },
  trendingTagText: {
    color: '#1976D2',
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    color: '#212121',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1976D2',
  },
  clearText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FF4444',
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
  },
  imageItem: {
    width: IMAGE_SIZE,
  },
  imageContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
    position: 'relative',
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
  },
  searchResultOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(25, 118, 210, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  matchScore: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Roboto-Medium',
    color: '#757575',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9E9E9E',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1976D2',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  emptyButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  albumsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  albumCard: {
    width: 140,
  },
  albumCover: {
    width: 140,
    height: 140,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
    marginBottom: 8,
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
  albumTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#212121',
    marginBottom: 4,
  },
  albumCount: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#757575',
  },
  floatingSearchButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
  },
  floatingButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1976D2',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  bottomPadding: {
    height: 100,
  },
});
