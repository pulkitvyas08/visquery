import { useState } from 'react';
import { ImageItem, SearchResult } from '@/types';
import { useImageGallery } from './useImageGallery';

export function useImageSearch() {
  const [isSearching, setIsSearching] = useState(false);
  const { images } = useImageGallery();

  const recentSearches = [
    'sunset beach',
    'mountain landscape',
    'city lights',
    'coffee morning',
    'flower garden'
  ];

  const suggestedSearches = [
    'nature photos',
    'people smiling',
    'food and drinks',
    'animals',
    'night photos',
    'text in images'
  ];

  const searchImages = async (query: string): Promise<SearchResult[]> => {
    setIsSearching(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const results: SearchResult[] = [];
      const searchTerm = query.toLowerCase().trim();
      
      for (const image of images) {
        let score = 0;
        let matchType: SearchResult['matchType'] = 'text';
        
        // Search in caption
        if (image.caption && image.caption.toLowerCase().includes(searchTerm)) {
          score += 0.9;
          matchType = 'caption';
        }
        
        // Search in tags
        const tagMatches = image.tags.filter(tag => 
          tag.toLowerCase().includes(searchTerm)
        );
        if (tagMatches.length > 0) {
          score += 0.8 * (tagMatches.length / image.tags.length);
          matchType = 'tag';
        }
        
        // Search in text content
        if (image.metadata.textContent && 
            image.metadata.textContent.toLowerCase().includes(searchTerm)) {
          score += 0.7;
          matchType = 'text';
        }
        
        // Search in people
        if (image.metadata.people && 
            image.metadata.people.some(person => 
              person.toLowerCase().includes(searchTerm)
            )) {
          score += 0.8;
          matchType = 'semantic';
        }
        
        // Search in objects
        if (image.metadata.objects && 
            image.metadata.objects.some(object => 
              object.toLowerCase().includes(searchTerm)
            )) {
          score += 0.6;
          matchType = 'semantic';
        }
        
        // Search in filename
        if (image.fileName.toLowerCase().includes(searchTerm)) {
          score += 0.5;
        }
        
        // Semantic search simulation
        if (score === 0) {
          const semanticKeywords = {
            'sunset': ['orange', 'evening', 'sky', 'horizon'],
            'beach': ['sand', 'ocean', 'water', 'waves'],
            'mountain': ['peak', 'landscape', 'hiking', 'nature'],
            'city': ['urban', 'buildings', 'lights', 'skyline'],
            'nature': ['trees', 'flowers', 'outdoor', 'landscape'],
            'coffee': ['morning', 'drink', 'cozy', 'lifestyle'],
          };
          
          const keywords = semanticKeywords[searchTerm as keyof typeof semanticKeywords];
          if (keywords) {
            const semanticMatches = keywords.filter(keyword => 
              image.tags.some(tag => tag.toLowerCase().includes(keyword)) ||
              (image.caption && image.caption.toLowerCase().includes(keyword))
            );
            if (semanticMatches.length > 0) {
              score = 0.4 * (semanticMatches.length / keywords.length);
              matchType = 'semantic';
            }
          }
        }
        
        if (score > 0) {
          results.push({
            item: image,
            score,
            matchType,
          });
        }
      }
      
      return results.sort((a, b) => b.score - a.score);
      
    } finally {
      setIsSearching(false);
    }
  };

  const getSuggestions = async (query: string): Promise<string[]> => {
    const allTags = new Set<string>();
    images.forEach(image => {
      image.tags.forEach(tag => allTags.add(tag));
    });
    
    const suggestions = Array.from(allTags)
      .filter(tag => tag.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5);
      
    return suggestions;
  };

  return {
    searchImages,
    getSuggestions,
    isSearching,
    recentSearches,
    suggestedSearches,
  };
}