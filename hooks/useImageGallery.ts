import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ImageItem, Album } from '@/types';
import * as MediaLibrary from 'expo-media-library';

const AI_PROCESSED_KEY = 'ai-gallery-processed';
const USER_ALBUMS_KEY = 'ai-gallery-user-albums';
const FAVORITES_KEY = 'ai-gallery-favorites';

export function useImageGallery() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiProcessedImages, setAiProcessedImages] = useState<
    Map<string, Partial<ImageItem>>
  >(new Map());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load only AI-processed image metadata (small dataset)
      const storedProcessed = await AsyncStorage.getItem(AI_PROCESSED_KEY);
      if (storedProcessed) {
        const processedArray: [string, Partial<ImageItem>][] =
          JSON.parse(storedProcessed);
        const processedMap = new Map<string, Partial<ImageItem>>(
          processedArray
        );
        setAiProcessedImages(processedMap);
      }

      // Load user-created albums (small dataset)
      const storedUserAlbums = await AsyncStorage.getItem(USER_ALBUMS_KEY);
      if (storedUserAlbums) {
        const userAlbums: Album[] = JSON.parse(storedUserAlbums);
        setAlbums(userAlbums);
      }
    } catch (error) {
      console.error('Error loading gallery data:', error);
    } finally {
      setLoading(false);
    }
  };

  const mergeMediaAssets = useCallback(
    async (
      mediaAssets: MediaLibrary.Asset[],
      mediaAlbums: MediaLibrary.Album[] = []
    ) => {
      try {
        console.log(
          `Merging ${mediaAssets.length} media assets and ${mediaAlbums.length} albums`
        );

        // Convert device images to our format WITHOUT storing them in AsyncStorage
        // Only enrich with AI data if available
        const convertedImages: ImageItem[] = mediaAssets.map((asset) => {
          const aiData = aiProcessedImages.get(asset.id);

          return {
            id: asset.id,
            uri: asset.uri,
            fileName: asset.filename || `IMG_${asset.id}.jpg`,
            createdAt: new Date(asset.creationTime).toISOString(),
            modifiedAt: new Date(
              asset.modificationTime || asset.creationTime
            ).toISOString(),
            size: 0, // MediaLibrary doesn't provide file size
            width: asset.width,
            height: asset.height,
            caption: aiData?.caption || '',
            tags: aiData?.tags || [],
            albumId: asset.albumId || undefined,
            metadata: aiData?.metadata || {
              textContent: '',
              people: [],
              objects: [],
              colors: [],
              mood: '',
              scene: '',
            },
            embedding: aiData?.embedding,
          };
        });

        // Set images in memory only - NO AsyncStorage
        setImages(convertedImages);

        // Convert device albums to our format
        const convertedAlbums: Album[] = await Promise.all(
          mediaAlbums.map(async (album) => {
            try {
              // Get first asset for cover image
              const albumAssets = await MediaLibrary.getAssetsAsync({
                album: album,
                first: 1,
                mediaType: 'photo',
              });

              return {
                id: album.id,
                title: album.title,
                count: album.assetCount || 0,
                coverImage: albumAssets.assets[0]?.uri || undefined,
                createdAt: new Date().toISOString(),
              };
            } catch (error) {
              console.error(`Error processing album ${album.title}:`, error);
              return {
                id: album.id,
                title: album.title,
                count: album.assetCount || 0,
                coverImage: undefined,
                createdAt: new Date().toISOString(),
              };
            }
          })
        );

        // Merge with user-created albums
        const existingUserAlbums = albums.filter(
          (album) => !album.id.startsWith('device-')
        );
        const allAlbums = [...convertedAlbums, ...existingUserAlbums];
        setAlbums(allAlbums);

        console.log(
          `Successfully merged ${convertedImages.length} images and ${allAlbums.length} albums`
        );
      } catch (error) {
        console.error('Error merging media assets:', error);
      }
    },
    [aiProcessedImages, albums]
  );

  const saveAiProcessedData = async (
    newProcessedMap: Map<string, Partial<ImageItem>>
  ) => {
    try {
      // Only save AI-processed metadata, not the full images
      const dataToSave: [string, Partial<ImageItem>][] = Array.from(
        newProcessedMap.entries()
      );
      await AsyncStorage.setItem(AI_PROCESSED_KEY, JSON.stringify(dataToSave));
      setAiProcessedImages(newProcessedMap);
    } catch (error) {
      const err = error as any;
      console.error('Error saving AI processed data:', error);

      // If storage is full, try to save only the most recent AI processed data
      if (
        err.message?.includes('full') ||
        err.message?.includes('SQLITE_FULL')
      ) {
        try {
          console.log('Storage full - reducing AI processed data...');
          const recentEntries: [string, Partial<ImageItem>][] = Array.from(
            newProcessedMap.entries()
          ).slice(0, 1000);
          const reducedMap = new Map<string, Partial<ImageItem>>(recentEntries);
          await AsyncStorage.setItem(
            AI_PROCESSED_KEY,
            JSON.stringify(recentEntries)
          );
          setAiProcessedImages(reducedMap);
          console.log(
            `Reduced AI processed data to ${recentEntries.length} entries`
          );
        } catch (fallbackError) {
          console.error('Failed to save even reduced AI data:', fallbackError);
        }
      }
    }
  };

  const addImage = async (image: ImageItem) => {
    // For new images (like camera captures), add AI processed data to storage
    const newProcessedMap = new Map(aiProcessedImages);
    newProcessedMap.set(image.id, {
      caption: image.caption,
      tags: image.tags,
      metadata: image.metadata,
      embedding: image.embedding,
    });

    await saveAiProcessedData(newProcessedMap);

    // Update the images list in memory
    const updatedImages = [image, ...images];
    setImages(updatedImages);
  };

  const removeImage = async (imageId: string) => {
    // Remove from AI processed data
    const newProcessedMap = new Map(aiProcessedImages);
    newProcessedMap.delete(imageId);
    await saveAiProcessedData(newProcessedMap);

    // Update images list in memory
    const updatedImages = images.filter((img) => img.id !== imageId);
    setImages(updatedImages);
  };

  const updateImage = async (imageId: string, updates: Partial<ImageItem>) => {
    // Update AI processed data only
    const newProcessedMap = new Map(aiProcessedImages);
    const existing = newProcessedMap.get(imageId) || {};
    newProcessedMap.set(imageId, {
      ...existing,
      caption: updates.caption,
      tags: updates.tags,
      metadata: updates.metadata,
      embedding: updates.embedding,
    });

    await saveAiProcessedData(newProcessedMap);

    // Update images list in memory
    const updatedImages = images.map((img) =>
      img.id === imageId ? { ...img, ...updates } : img
    );
    setImages(updatedImages);
  };

  const refreshImages = async () => {
    await loadData();
  };

  // Get storage usage info (only for AI data, not device images)
  const getStorageInfo = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const galleryKeys = keys.filter((key) => key.startsWith('ai-gallery-'));

      let totalSize = 0;
      for (const key of galleryKeys) {
        const data = await AsyncStorage.getItem(key);
        if (data) {
          totalSize += new Blob([data]).size;
        }
      }

      return {
        aiProcessedCount: aiProcessedImages.size,
        totalDeviceImages: images.length,
        storageUsedMB: Math.round((totalSize / (1024 * 1024)) * 100) / 100,
        storageKeys: galleryKeys,
      };
    } catch (error) {
      console.error('Error getting storage info:', error);
      return {
        aiProcessedCount: 0,
        totalDeviceImages: 0,
        storageUsedMB: 0,
        storageKeys: [],
      };
    }
  };

  // Clear storage if needed
  const clearStorage = async () => {
    try {
      await AsyncStorage.removeItem(AI_PROCESSED_KEY);
      await AsyncStorage.removeItem(USER_ALBUMS_KEY);
      await AsyncStorage.removeItem(FAVORITES_KEY);
      setAiProcessedImages(new Map());
      console.log('Storage cleared successfully');
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  };

  return {
    images,
    albums,
    loading,
    addImage,
    removeImage,
    updateImage,
    refreshImages,
    mergeMediaAssets,
    getStorageInfo,
    clearStorage,
    aiProcessedImages,
  };
}
