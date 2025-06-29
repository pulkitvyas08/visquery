import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as MediaLibrary from 'expo-media-library';

export function useMediaLibrary() {
  const [hasPermissions, setHasPermissions] = useState(false);
  const [mediaAssets, setMediaAssets] = useState<MediaLibrary.Asset[]>([]);
  const [albums, setAlbums] = useState<MediaLibrary.Album[]>([]);
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
        await loadAllData();
      }

      return granted;
    } catch (error) {
      console.error('Error requesting media library permissions:', error);
      return false;
    }
  };

  const loadAllData = async () => {
    if (!hasPermissions || Platform.OS === 'web') return;

    try {
      setLoading(true);

      // Load ALL photos (not just 100) using pagination
      let allAssets: MediaLibrary.Asset[] = [];
      let hasNextPage = true;
      let after: string | undefined;

      console.log('Starting to load all photos from device...');

      while (hasNextPage) {
        const media = await MediaLibrary.getAssetsAsync({
          mediaType: 'photo',
          first: 1000, // Load in batches of 1000
          sortBy: 'creationTime',
          after,
        });

        allAssets = [...allAssets, ...media.assets];
        hasNextPage = media.hasNextPage;
        after = media.endCursor;

        console.log(
          `Loaded ${media.assets.length} photos, total: ${allAssets.length}, hasNextPage: ${hasNextPage}`
        );
      }

      console.log(`Finished loading all photos. Total: ${allAssets.length}`);
      setMediaAssets(allAssets);

      // Load ALL albums from device
      console.log('Loading albums from device...');
      const albumsResult = await MediaLibrary.getAlbumsAsync({
        includeSmartAlbums: true,
      });

      console.log(`Loaded ${albumsResult.length} albums from device`);
      setAlbums(albumsResult);
    } catch (error) {
      console.error('Error loading media assets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasPermissions) {
      loadAllData();
    }
  }, [hasPermissions]);

  return {
    hasPermissions,
    mediaAssets,
    albums,
    loading,
    requestPermissions,
    loadAllData,
  };
}
