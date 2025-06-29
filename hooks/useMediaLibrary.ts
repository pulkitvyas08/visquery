import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as MediaLibrary from 'expo-media-library';

export function useMediaLibrary() {
  const [hasPermissions, setHasPermissions] = useState(false);
  const [mediaAssets, setMediaAssets] = useState<MediaLibrary.Asset[]>([]);
  const [loading, setLoading] = useState(false);

  const requestPermissions = async () => {
    if (Platform.OS === 'web') {
      // Web doesn't support MediaLibrary
      setHasPermissions(false);
      return false;
    }

    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      const granted = status === 'granted';
      setHasPermissions(granted);
      
      if (granted) {
        await loadMediaAssets();
      }
      
      return granted;
    } catch (error) {
      console.error('Error requesting media library permissions:', error);
      return false;
    }
  };

  const loadMediaAssets = async () => {
    if (!hasPermissions || Platform.OS === 'web') return;

    try {
      setLoading(true);
      const media = await MediaLibrary.getAssetsAsync({
        mediaType: 'photo',
        first: 100,
        sortBy: 'creationTime',
      });
      
      setMediaAssets(media.assets);
    } catch (error) {
      console.error('Error loading media assets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasPermissions) {
      loadMediaAssets();
    }
  }, [hasPermissions]);

  return {
    hasPermissions,
    mediaAssets,
    loading,
    requestPermissions,
    loadMediaAssets,
  };
}