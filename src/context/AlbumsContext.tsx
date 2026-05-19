import { createContext, useContext, useEffect, useState } from 'react';

import { albumTemplates } from '../data/fifa2026Seed';
import type { AlbumTemplate, UserAlbum, UserStickerEntry } from '../models/types';
import { loadPersistedState, savePersistedState } from '../storage/persistence';

type AlbumTransferEntry = {
  slotId: string;
  quantity: number;
};

type AlbumTransferPayload = {
  version: 1;
  exportedAt: string;
  album: {
    templateId: string;
    customName: string;
    createdAt: string;
  };
  entries: AlbumTransferEntry[];
};

type AlbumsContextValue = {
  templates: AlbumTemplate[];
  userAlbums: UserAlbum[];
  userStickerEntries: UserStickerEntry[];
  isReady: boolean;
  createAlbum: (templateId: string, customName: string) => UserAlbum;
  addSticker: (albumId: string, slotId: string) => void;
  removeSticker: (albumId: string, slotId: string) => void;
  markMissing: (albumId: string, slotId: string) => void;
  exportAlbum: (albumId: string) => string;
  importAlbum: (serializedAlbum: string) => UserAlbum;
  getTemplateById: (templateId: string) => AlbumTemplate | undefined;
  getAlbumById: (albumId: string) => UserAlbum | undefined;
  getEntriesForAlbum: (albumId: string) => UserStickerEntry[];
};

const AlbumsContext = createContext<AlbumsContextValue | undefined>(undefined);

const createId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const isAlbumTransferPayload = (value: unknown): value is AlbumTransferPayload => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const payload = value as Partial<AlbumTransferPayload>;

  return (
    payload.version === 1 &&
    typeof payload.exportedAt === 'string' &&
    typeof payload.album === 'object' &&
    payload.album !== null &&
    typeof payload.album.templateId === 'string' &&
    typeof payload.album.customName === 'string' &&
    typeof payload.album.createdAt === 'string' &&
    Array.isArray(payload.entries) &&
    payload.entries.every(
      (entry) =>
        entry &&
        typeof entry === 'object' &&
        typeof entry.slotId === 'string' &&
        typeof entry.quantity === 'number',
    )
  );
};

export const AlbumsProvider = ({ children }: { children: React.ReactNode }) => {
  const [userAlbums, setUserAlbums] = useState<UserAlbum[]>([]);
  const [userStickerEntries, setUserStickerEntries] = useState<UserStickerEntry[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const hydrate = async () => {
      const persisted = await loadPersistedState();
      setUserAlbums(persisted.userAlbums);
      setUserStickerEntries(persisted.userStickerEntries);
      setIsReady(true);
    };

    void hydrate();
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    void savePersistedState({ userAlbums, userStickerEntries });
  }, [isReady, userAlbums, userStickerEntries]);

  const updateQuantity = (albumId: string, slotId: string, nextQuantity: number) => {
    setUserStickerEntries((currentEntries) => {
      const existing = currentEntries.find(
        (entry) => entry.albumId === albumId && entry.slotId === slotId,
      );

      if (!existing && nextQuantity <= 0) {
        return currentEntries;
      }

      if (!existing && nextQuantity > 0) {
        return [...currentEntries, { albumId, slotId, quantity: nextQuantity }];
      }

      if (existing && nextQuantity <= 0) {
        return currentEntries.filter(
          (entry) => !(entry.albumId === albumId && entry.slotId === slotId),
        );
      }

      return currentEntries.map((entry) =>
        entry.albumId === albumId && entry.slotId === slotId
          ? { ...entry, quantity: nextQuantity }
          : entry,
      );
    });
  };

  const createAlbum = (templateId: string, customName: string) => {
    const album: UserAlbum = {
      id: createId('album'),
      templateId,
      customName,
      createdAt: new Date().toISOString(),
    };

    setUserAlbums((currentAlbums) => [album, ...currentAlbums]);
    return album;
  };

  const addSticker = (albumId: string, slotId: string) => {
    const existing = userStickerEntries.find(
      (entry) => entry.albumId === albumId && entry.slotId === slotId,
    );

    updateQuantity(albumId, slotId, (existing?.quantity ?? 0) + 1);
  };

  const removeSticker = (albumId: string, slotId: string) => {
    const existing = userStickerEntries.find(
      (entry) => entry.albumId === albumId && entry.slotId === slotId,
    );

    updateQuantity(albumId, slotId, Math.max((existing?.quantity ?? 0) - 1, 0));
  };

  const markMissing = (albumId: string, slotId: string) => {
    updateQuantity(albumId, slotId, 0);
  };

  const exportAlbum = (albumId: string) => {
    const album = userAlbums.find((currentAlbum) => currentAlbum.id === albumId);

    if (!album) {
      throw new Error('Album not found.');
    }

    const payload: AlbumTransferPayload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      album: {
        templateId: album.templateId,
        customName: album.customName,
        createdAt: album.createdAt,
      },
      entries: userStickerEntries
        .filter((entry) => entry.albumId === albumId)
        .map((entry) => ({
          slotId: entry.slotId,
          quantity: entry.quantity,
        })),
    };

    return JSON.stringify(payload, null, 2);
  };

  const importAlbum = (serializedAlbum: string) => {
    let parsed: unknown;

    try {
      parsed = JSON.parse(serializedAlbum);
    } catch {
      throw new Error('Invalid JSON.');
    }

    if (!isAlbumTransferPayload(parsed)) {
      throw new Error('Unsupported album export format.');
    }

    const template = albumTemplates.find((currentTemplate) => currentTemplate.id === parsed.album.templateId);

    if (!template) {
      throw new Error('This album template is not available in the app.');
    }

    const validSlotIds = new Set(template.slots.map((slot) => slot.id));
    const invalidEntry = parsed.entries.find(
      (entry) =>
        !Number.isInteger(entry.quantity) ||
        entry.quantity <= 0 ||
        !validSlotIds.has(entry.slotId),
    );

    if (invalidEntry) {
      throw new Error('The pasted album contains unsupported sticker entries.');
    }

    const importedAlbum: UserAlbum = {
      id: createId('album'),
      templateId: parsed.album.templateId,
      customName: parsed.album.customName.trim() || 'Imported album',
      createdAt: new Date().toISOString(),
    };

    const importedEntries: UserStickerEntry[] = parsed.entries.map((entry) => ({
      albumId: importedAlbum.id,
      slotId: entry.slotId,
      quantity: entry.quantity,
    }));

    setUserAlbums((currentAlbums) => [importedAlbum, ...currentAlbums]);
    setUserStickerEntries((currentEntries) => [...importedEntries, ...currentEntries]);

    return importedAlbum;
  };

  const getTemplateById = (templateId: string) =>
    albumTemplates.find((template) => template.id === templateId);

  const getAlbumById = (albumId: string) => userAlbums.find((album) => album.id === albumId);

  const getEntriesForAlbum = (albumId: string) =>
    userStickerEntries.filter((entry) => entry.albumId === albumId);

  return (
    <AlbumsContext.Provider
      value={{
        templates: albumTemplates,
        userAlbums,
        userStickerEntries,
        isReady,
        createAlbum,
        addSticker,
        removeSticker,
        markMissing,
        exportAlbum,
        importAlbum,
        getTemplateById,
        getAlbumById,
        getEntriesForAlbum,
      }}
    >
      {children}
    </AlbumsContext.Provider>
  );
};

export const useAlbums = () => {
  const context = useContext(AlbumsContext);

  if (!context) {
    throw new Error('useAlbums must be used within AlbumsProvider');
  }

  return context;
};