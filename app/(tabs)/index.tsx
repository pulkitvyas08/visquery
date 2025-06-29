import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, Sparkles, Clock, TrendingUp as Trending } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useImageSearch } from '@/hooks/useImageSearch';
import { SearchResult } from '@/types';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'sunset beach',
    'family photos',
    'dog playing',
    'birthday party'
  ]);
  const [isSearching, setIsSearching] = useState(false);
  
  const { searchImages, getSuggestions } = useImageSearch();

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await searchImages(query);
      setSearchResults(results);
      
      // Add to recent searches
      setRecentSearches(prev => {
        const filtered = prev.filter(item => item !== query);
        return [query, ...filtered].slice(0, 8);
      });
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const suggestedSearches = [
    { text: 'Photos with text', icon: '📝' },
    { text: 'People smiling', icon: '😊' },
    { text: 'Nature landscapes', icon: '🌄' },
    { text: 'Food and drinks', icon: '🍕' },
    { text: 'Animals', icon: '🐕' },
    { text: 'Night photos', icon: '🌙' },
  ];

  return (
    <LinearGradient
      colors={['#0F172A', '#1E293B', '#334155']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
            <Text style={styles.title}>AI Gallery Search</Text>
            <Text style={styles.subtitle}>
              Search by anything - text, people, objects, or describe what you're looking for
            </Text>
          </Animated.View>

          {/* Search Bar */}
          <Animated.View entering={FadeInDown.delay(200)} style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Search size={20} color="#6B7280" strokeWidth={2} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search your photos with AI..."
                placeholderTextColor="#6B7280"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={() => handleSearch(searchQuery)}
                returnKeyType="search"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => handleSearch(searchQuery)}>
                  <Sparkles size={20} color="#3B82F6" strokeWidth={2} />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity style={styles.filterButton}>
              <Filter size={18} color="#3B82F6" strokeWidth={2} />
            </TouchableOpacity>
          </Animated.View>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
              <Text style={styles.sectionTitle}>
                Results ({searchResults.length})
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {searchResults.map((result, index) => (
                  <Animated.View
                    key={result.item.id}
                    entering={FadeInRight.delay(index * 100)}
                    style={styles.resultCard}
                  >
                    <Image source={{ uri: result.item.uri }} style={styles.resultImage} />
                    <View style={styles.resultOverlay}>
                      <Text style={styles.resultScore}>
                        {Math.round(result.score * 100)}% match
                      </Text>
                    </View>
                  </Animated.View>
                ))}
              </ScrollView>
            </Animated.View>
          )}

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
              <View style={styles.sectionHeader}>
                <Clock size={18} color="#9CA3AF" strokeWidth={2} />
                <Text style={styles.sectionTitle}>Recent Searches</Text>
              </View>
              <View style={styles.tagContainer}>
                {recentSearches.map((search, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.tag}
                    onPress={() => {
                      setSearchQuery(search);
                      handleSearch(search);
                    }}
                  >
                    <Text style={styles.tagText}>{search}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>
          )}

          {/* Suggested Searches */}
          <Animated.View entering={FadeInDown.delay(500)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Trending size={18} color="#9CA3AF" strokeWidth={2} />
              <Text style={styles.sectionTitle}>Try Searching For</Text>
            </View>
            <View style={styles.suggestionGrid}>
              {suggestedSearches.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionCard}
                  onPress={() => {
                    setSearchQuery(suggestion.text);
                    handleSearch(suggestion.text);
                  }}
                >
                  <Text style={styles.suggestionIcon}>{suggestion.icon}</Text>
                  <Text style={styles.suggestionText}>{suggestion.text}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>

          {/* Bottom Padding for Tab Bar */}
          <View style={styles.bottomPadding} />
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
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
  },
  title: {
    fontSize: 32,
    fontFamily: 'SpaceGrotesk-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    lineHeight: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 32,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
  },
  filterButton: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#E2E8F0',
  },
  suggestionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  suggestionCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    width: (width - 60) / 2,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  suggestionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  suggestionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#E2E8F0',
    textAlign: 'center',
  },
  resultCard: {
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  resultImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
  },
  resultOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 8,
  },
  resultScore: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  bottomPadding: {
    height: 120,
  },
});