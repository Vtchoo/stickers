import AsyncStorage from '@react-native-async-storage/async-storage';

import type { PersistedAlbumState } from '../models/types';

const STORAGE_KEY = 'sticker-album-manager/state/v1';

const emptyState: PersistedAlbumState = {
  userAlbums: [],
  userStickerEntries: [],
};

export const loadPersistedState = async (): Promise<PersistedAlbumState> => {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return emptyState;
  }

  try {
    const parsed = JSON.parse(stored) as PersistedAlbumState;

    return {
      userAlbums: parsed.userAlbums ?? [],
      userStickerEntries: parsed.userStickerEntries ?? [],
    };
  } catch {
    return emptyState;
  }
};

export const savePersistedState = async (state: PersistedAlbumState) => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};