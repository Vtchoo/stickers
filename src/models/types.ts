import type { ReactNode } from 'react';

export type StickerType = 'player' | 'team_logo' | 'stadium' | 'special' | 'other';

export type StickerFilter = 'all' | 'owned' | 'missing' | 'duplicates';

export interface AlbumTemplateGroup {
  id: string;
  name: string;
  icon?: ReactNode;
  section: 'team' | 'special';
  groupLetter?: string;
  teamCode?: string;
  teamName?: string;
  color: string;
  sortOrder: number;
  verified: boolean;
  note?: string;
}

export interface StickerSlot {
  id: string;
  groupId: string;
  label: string;
  type: StickerType;
  page: number;
  position: number;
  verified: boolean;
  required: boolean;
  teamCode?: string;
  teamName?: string;
  country?: string;
  groupName?: string;
  playerName?: string;
  positionName?: string;
  note?: string;
  searchableText: string;
}

export interface AlbumTemplate {
  id: string;
  name: string;
  year: number;
  publisher: string;
  groups: AlbumTemplateGroup[];
  slots: StickerSlot[];
  sourceSummary: {
    verified: string[];
    placeholder: string[];
    officialSources: string[];
    communitySources: string[];
  };
}

export interface UserAlbum {
  id: string;
  templateId: string;
  customName: string;
  createdAt: string;
}

export interface UserStickerEntry {
  albumId: string;
  slotId: string;
  quantity: number;
}

export interface AlbumStats {
  totalSlots: number;
  ownedUnique: number;
  ownedRequired: number;
  missing: number;
  duplicateCount: number;
  completionPercentage: number;
}

export interface PersistedAlbumState {
  userAlbums: UserAlbum[];
  userStickerEntries: UserStickerEntry[];
}