export interface ImageItem {
  id: string;
  uri: string;
  fileName: string;
  createdAt: string;
  modifiedAt: string;
  size: number;
  width: number;
  height: number;
  caption?: string;
  tags: string[];
  albumId?: string;
  metadata: ImageMetadata;
  embedding?: number[];
}

export interface ImageMetadata {
  location?: {
    latitude: number;
    longitude: number;
  };
  camera?: {
    make: string;
    model: string;
  };
  settings?: {
    iso: number;
    aperture: number;
    shutterSpeed: string;
  };
  textContent?: string;
  people?: string[];
  objects?: string[];
  colors?: string[];
  mood?: string;
  scene?: string;
}

export interface Album {
  id: string;
  title: string;
  count: number;
  coverImage?: string;
  createdAt: string;
}

export interface SearchResult {
  item: ImageItem;
  score: number;
  matchType: 'text' | 'tag' | 'caption' | 'semantic';
}

export interface ProcessingStatus {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  message?: string;
}