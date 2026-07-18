import type { StickerSlot } from '../models/types';
import { getDuplicateCount } from './album';

type Translations = {
  albumLabel: string;
  missingHeader: string;
  duplicatesHeader: string;
  noneLabel: string;
  tradeableCount: (n: number) => string;
  missingCount: (n: number) => string;
};

const LANGS: Record<string, Translations> = {
  en: {
    albumLabel: 'Album',
    missingHeader: 'These stickers are missing from my album',
    duplicatesHeader: 'Here are my duplicate stickers',
    noneLabel: 'None',
    tradeableCount: (n) => `${n} tradeable`,
    missingCount: (n) => `${n} missing`,
  },
  pt: {
    albumLabel: 'Álbum',
    missingHeader: 'Faltam estas figurinhas para eu completar meu álbum',
    duplicatesHeader: 'Aqui estão minhas figurinhas repetidas',
    noneLabel: 'Nenhuma',
    tradeableCount: (n) => `${n} para trocar`,
    missingCount: (n) => `${n} faltando`,
  },
  es: {
    albumLabel: 'Álbum',
    missingHeader: 'Me faltan estas figuritas para completar mi álbum',
    duplicatesHeader: 'Aquí están mis figuritas repetidas',
    noneLabel: 'Ninguna',
    tradeableCount: (n) => `${n} para cambiar`,
    missingCount: (n) => `${n} faltantes`,
  },
  fr: {
    albumLabel: 'Album',
    missingHeader: 'Il me manque ces vignettes pour compléter mon album',
    duplicatesHeader: 'Voici mes vignettes en double',
    noneLabel: 'Aucune',
    tradeableCount: (n) => `${n} à échanger`,
    missingCount: (n) => `${n} manquantes`,
  },
  de: {
    albumLabel: 'Album',
    missingHeader: 'Diese Sticker fehlen mir noch für mein Album',
    duplicatesHeader: 'Das sind meine doppelten Sticker',
    noneLabel: 'Keine',
    tradeableCount: (n) => `${n} zum Tauschen`,
    missingCount: (n) => `${n} fehlend`,
  },
  it: {
    albumLabel: 'Album',
    missingHeader: 'Queste figurine mi mancano per completare il mio album',
    duplicatesHeader: 'Ecco le mie figurine ripetute',
    noneLabel: 'Nessuna',
    tradeableCount: (n) => `${n} da scambiare`,
    missingCount: (n) => `${n} mancanti`,
  },
};

export const getDeviceLanguage = (): string => {
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;
    return locale.split('-')[0].toLowerCase();
  } catch {
    return 'en';
  }
};

const getTranslations = (): Translations => {
  const lang = getDeviceLanguage();
  return LANGS[lang] ?? LANGS['en'];
};

const slotGroup = (slot: StickerSlot): string =>
  slot.teamName ?? slot.groupName ?? 'Special';

const groupSlots = <T extends { slot: StickerSlot }>(items: T[]): Map<string, T[]> => {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const key = slotGroup(item.slot);
    const bucket = map.get(key);
    if (bucket) {
      bucket.push(item);
    } else {
      map.set(key, [item]);
    }
  }
  return map;
};

export const buildMissingShareText = (albumName: string, missingSlots: StickerSlot[]): string => {
  const t = getTranslations();
  const lines: string[] = [];

//   lines.push(`📒 ${t.albumLabel}: ${albumName}`);
//   lines.push('');
  lines.push(`📌 ${t.missingHeader}:`);
  lines.push('');

  if (missingSlots.length === 0) {
    lines.push(t.noneLabel);
  } else {
    const grouped = groupSlots(missingSlots.map((slot) => ({ slot })));
    for (const [group, items] of grouped) {
      lines.push(`${group}: ${items.map((i) => i.slot.id).join(', ')}`);
    }
    lines.push('');
    lines.push(`(${t.missingCount(missingSlots.length)})`);
  }

  return lines.join('\n');
};

export const buildDuplicatesShareText = (
  albumName: string,
  duplicateSlots: Array<{ slot: StickerSlot; quantity: number }>,
): string => {
  const t = getTranslations();
  const lines: string[] = [];

  const totalTradeables = duplicateSlots.reduce(
    (sum, { quantity }) => sum + getDuplicateCount(quantity),
    0,
  );

//   lines.push(`📒 ${t.albumLabel}: ${albumName}`);
//   lines.push('');
  lines.push(`🔁 ${t.duplicatesHeader}:`);
  lines.push('');

  if (duplicateSlots.length === 0) {
    lines.push(t.noneLabel);
  } else {
    const grouped = groupSlots(duplicateSlots);
    for (const [group, items] of grouped) {
      lines.push(
        `${group}: ${items.map(({ slot, quantity }) => `${slot.id} (${getDuplicateCount(quantity)})`).join(', ')}`,
      );
    }
    lines.push('');
    lines.push(`(${t.tradeableCount(totalTradeables)})`);
  }

  return lines.join('\n');
};
