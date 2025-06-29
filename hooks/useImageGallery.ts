import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ImageItem, Album } from '@/types';

const STORAGE_KEY = 'ai-gallery-images';
const ALBUMS_KEY = 'ai-gallery-albums';

export function useImageGallery() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load images
      const storedImages = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedImages) {
        const parsedImages = JSON.parse(storedImages);
        setImages(parsedImages);
      } else {
        // Initialize with sample data for demo
        const sampleImages = generateSampleImages();
        setImages(sampleImages);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sampleImages));
      }

      // Load albums
      const storedAlbums = await AsyncStorage.getItem(ALBUMS_KEY);
      if (storedAlbums) {
        const parsedAlbums = JSON.parse(storedAlbums);
        setAlbums(parsedAlbums);
      } else {
        // Initialize with sample albums
        const sampleAlbums = generateSampleAlbums();
        setAlbums(sampleAlbums);
        await AsyncStorage.setItem(ALBUMS_KEY, JSON.stringify(sampleAlbums));
      }
    } catch (error) {
      console.error('Error loading gallery data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSampleImages = (): ImageItem[] => {
    const sampleImages = [
      {
        id: '1',
        uri: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=800',
        fileName: 'sunset_beach.jpg',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        modifiedAt: new Date(Date.now() - 86400000).toISOString(),
        size: 2048000,
        width: 1920,
        height: 1080,
        caption: 'Beautiful sunset over the ocean with golden reflections on the water',
        tags: ['sunset', 'beach', 'ocean', 'golden hour', 'nature'],
        albumId: 'album1',
        metadata: {
          textContent: '',
          people: [],
          objects: ['ocean', 'sky', 'clouds', 'horizon'],
          colors: ['orange', 'blue', 'yellow', 'purple'],
          mood: 'peaceful',
          scene: 'outdoor',
        },
      },
      {
        id: '2',
        uri: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800',
        fileName: 'mountain_landscape.jpg',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        modifiedAt: new Date(Date.now() - 172800000).toISOString(),
        size: 3072000,
        width: 1920,
        height: 1280,
        caption: 'Majestic mountain range with snow-capped peaks under a clear blue sky',
        tags: ['mountains', 'landscape', 'snow', 'nature', 'hiking'],
        albumId: 'album2',
        metadata: {
          textContent: '',
          people: [],
          objects: ['mountain', 'snow', 'sky', 'rocks'],
          colors: ['blue', 'white', 'gray', 'green'],
          mood: 'majestic',
          scene: 'outdoor',
        },
      },
      {
        id: '3',
        uri: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=800',
        fileName: 'city_night.jpg',
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        modifiedAt: new Date(Date.now() - 259200000).toISOString(),
        size: 2560000,
        width: 1920,
        height: 1080,
        caption: 'Vibrant city skyline at night with illuminated skyscrapers',
        tags: ['city', 'night', 'lights', 'urban', 'skyline'],
        albumId: 'album3',
        metadata: {
          textContent: '',
          people: [],
          objects: ['buildings', 'lights', 'cars', 'roads'],
          colors: ['blue', 'yellow', 'orange', 'purple'],
          mood: 'energetic',
          scene: 'urban',
        },
      },
      {
        id: '4',
        uri: 'https://images.pexels.com/photos/1133957/pexels-photo-1133957.jpeg?auto=compress&cs=tinysrgb&w=800',
        fileName: 'forest_path.jpg',
        createdAt: new Date(Date.now() - 345600000).toISOString(),
        modifiedAt: new Date(Date.now() - 345600000).toISOString(),
        size: 1843200,
        width: 1920,
        height: 1280,
        caption: 'Peaceful forest path surrounded by tall trees and dappled sunlight',
        tags: ['forest', 'path', 'trees', 'nature', 'peaceful'],
        albumId: 'album2',
        metadata: {
          textContent: '',
          people: [],
          objects: ['trees', 'path', 'leaves', 'sunlight'],
          colors: ['green', 'brown', 'yellow'],
          mood: 'peaceful',
          scene: 'outdoor',
        },
      },
      {
        id: '5',
        uri: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
        fileName: 'coffee_morning.jpg',
        createdAt: new Date(Date.now() - 432000000).toISOString(),
        modifiedAt: new Date(Date.now() - 432000000).toISOString(),
        size: 1536000,
        width: 1920,
        height: 1080,
        caption: 'Cozy morning coffee setup with steam rising from a white cup',
        tags: ['coffee', 'morning', 'cozy', 'drink', 'lifestyle'],
        albumId: 'album4',
        metadata: {
          textContent: '',
          people: [],
          objects: ['coffee', 'cup', 'steam', 'table'],
          colors: ['brown', 'white', 'beige'],
          mood: 'cozy',
          scene: 'indoor',
        },
      },
      {
        id: '6',
        uri: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=800',
        fileName: 'flower_garden.jpg',
        createdAt: new Date(Date.now() - 518400000).toISOString(),
        modifiedAt: new Date(Date.now() - 518400000).toISOString(),
        size: 2048000,
        width: 1920,
        height: 1280,
        caption: 'Colorful flower garden in full bloom with various species',
        tags: ['flowers', 'garden', 'colorful', 'nature', 'spring'],
        albumId: 'album2',
        metadata: {
          textContent: '',
          people: [],
          objects: ['flowers', 'petals', 'stems', 'leaves'],
          colors: ['red', 'yellow', 'pink', 'green'],
          mood: 'cheerful',
          scene: 'outdoor',
        },
      },
    ];

    return sampleImages;
  };

  const generateSampleAlbums = (): Album[] => {
    return [
      {
        id: 'album1',
        title: 'Beach Vacation',
        count: 1,
        coverImage: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=800',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 'album2',
        title: 'Nature & Landscapes',
        count: 3,
        coverImage: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
      },
      {
        id: 'album3',
        title: 'City Life',
        count: 1,
        coverImage: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=800',
        createdAt: new Date(Date.now() - 259200000).toISOString(),
      },
      {
        id: 'album4',
        title: 'Daily Moments',
        count: 1,
        coverImage: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
        createdAt: new Date(Date.now() - 432000000).toISOString(),
      },
    ];
  };

  const saveImages = async (newImages: ImageItem[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newImages));
      setImages(newImages);
    } catch (error) {
      console.error('Error saving images:', error);
    }
  };

  const addImage = async (image: ImageItem) => {
    const updatedImages = [image, ...images];
    await saveImages(updatedImages);
  };

  const removeImage = async (imageId: string) => {
    const updatedImages = images.filter(img => img.id !== imageId);
    await saveImages(updatedImages);
  };

  const updateImage = async (imageId: string, updates: Partial<ImageItem>) => {
    const updatedImages = images.map(img => 
      img.id === imageId ? { ...img, ...updates } : img
    );
    await saveImages(updatedImages);
  };

  const refreshImages = async () => {
    await loadData();
  };

  return {
    images,
    albums,
    loading,
    addImage,
    removeImage,
    updateImage,
    refreshImages,
  };
}