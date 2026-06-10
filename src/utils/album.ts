import type {
  AlbumStats,
  AlbumTemplate,
  StickerFilter,
  StickerSlot,
  UserStickerEntry,
} from '../models/types';

export const buildEntryMap = (entries: UserStickerEntry[]) =>
  entries.reduce<Record<string, number>>((result, entry) => {
    result[entry.slotId] = entry.quantity;
    return result;
  }, {});

export const getSlotQuantity = (entryMap: Record<string, number>, slotId: string) => entryMap[slotId] ?? 0;

export const getDuplicateCount = (quantity: number) => Math.max(quantity - 1, 0);

export const calculateAlbumStats = (
  template: AlbumTemplate,
  entryMap: Record<string, number>,
): AlbumStats => {
  const requiredSlots = template.slots.filter((slot) => slot.required);
  const totalSlots = requiredSlots.length;
  let ownedUnique = 0;
  let ownedRequired = 0;
  let duplicateCount = 0;

  template.slots.forEach((slot) => {
    const quantity = getSlotQuantity(entryMap, slot.id);
    if (quantity > 0) {
      ownedUnique += 1;
      duplicateCount += getDuplicateCount(quantity);
    }
  });

  requiredSlots.forEach((slot) => {
    if (getSlotQuantity(entryMap, slot.id) > 0) {
      ownedRequired += 1;
    }
  });

  const missing = totalSlots - ownedRequired;

  const ownedUniqueExtras = ownedUnique - ownedRequired;

  return {
    totalSlots,
    ownedUnique,
    ownedRequired,
    missing,
    duplicateCount,
    extras: ownedUniqueExtras,
    completionPercentage: totalSlots === 0 ? 0 : Math.min(100, Math.round((ownedRequired / totalSlots) * 100)),
  };
};

export const calculateGroupStats = (
  slots: StickerSlot[],
  entryMap: Record<string, number>,
): AlbumStats => {
  const template: AlbumTemplate = {
    id: 'temp',
    name: 'temp',
    year: 0,
    publisher: 'temp',
    groups: [],
    slots,
    sourceSummary: { verified: [], placeholder: [], officialSources: [], communitySources: [] },
  };

  return calculateAlbumStats(template, entryMap);
};

export const matchesFilter = (
  slot: StickerSlot,
  entryMap: Record<string, number>,
  filter: StickerFilter,
) => {
  const quantity = getSlotQuantity(entryMap, slot.id);

  if (filter === 'owned') {
    return quantity > 0;
  }

  if (filter === 'missing') {
    return quantity === 0;
  }

  if (filter === 'duplicates') {
    return quantity > 1;
  }

  return true;
};

export const matchesSearch = (slot: StickerSlot, query: string) => {
  if (!query.trim()) {
    return true;
  }

  return slot.searchableText.includes(query.trim().toLowerCase());
};

export const chunkSlots = (slots: StickerSlot[], chunkSize: number) => {
  const result: StickerSlot[][] = [];

  for (let index = 0; index < slots.length; index += chunkSize) {
    result.push(slots.slice(index, index + chunkSize));
  }

  return result;
};

export const formatPercentage = (value: number) => `${value}%`;