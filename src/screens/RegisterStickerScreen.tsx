import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';

import {
  Badge,
  BadgeText,
  Card,
  Chip,
  ChipRow,
  ChipText,
  EmptyState,
  Heading,
  Input,
  Label,
  MiniAction,
  MiniActionText,
  RowBetween,
  Screen,
  ScrollContent,
  SlotActionRow,
  SmallText,
  Subtitle,
} from '../components/ui';
import { useAlbums } from '../context/AlbumsContext';
import type { StickerFilter } from '../models/types';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { buildEntryMap, getDuplicateCount, getSlotQuantity, matchesFilter, matchesSearch } from '../utils/album';

type Props = NativeStackScreenProps<RootStackParamList, 'RegisterSticker'>;

const filters: StickerFilter[] = ['all', 'owned', 'missing', 'duplicates'];

export const RegisterStickerScreen = ({ route }: Props) => {
  const { albumId, initialSlotId } = route.params;
  const { getAlbumById, getTemplateById, getEntriesForAlbum, addSticker, removeSticker, markMissing } = useAlbums();
  const [search, setSearch] = useState(initialSlotId ?? '');
  const [filter, setFilter] = useState<StickerFilter>('all');

  const album = getAlbumById(albumId);
  const template = album ? getTemplateById(album.templateId) : undefined;

  if (!album || !template) {
    return (
      <Screen>
        <ScrollContent>
          <EmptyState>
            <Heading>Album unavailable</Heading>
          </EmptyState>
        </ScrollContent>
      </Screen>
    );
  }

  const entryMap = buildEntryMap(getEntriesForAlbum(album.id));
  const normalized = search.trim().toLowerCase();
  const directSlot = template.slots.find((slot) => slot.id.toLowerCase() === normalized);
  const results = template.slots.filter(
    (slot) => matchesSearch(slot, search) && matchesFilter(slot, entryMap, filter),
  );
  const visibleResults = search.trim() ? results : results.slice(0, 80);

  return (
    <Screen>
      <ScrollContent>
        <Card>
          <Heading>Register by search or slot ID</Heading>
          <Subtitle>
            Type a slot like bra-01 or stadium-01, or search by team, group, country, sticker type or placeholder player label.
          </Subtitle>
          <Input
            placeholder="bra-01"
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#7f8a92"
          />
          <ChipRow>
            {filters.map((item) => (
              <Chip key={item} $selected={filter === item} onPress={() => setFilter(item)}>
                <ChipText $selected={filter === item}>{item}</ChipText>
              </Chip>
            ))}
          </ChipRow>
          {directSlot ? (
            <Badge $tone="success" style={{ alignSelf: 'flex-start' }}>
              <BadgeText>Exact match: {directSlot.id}</BadgeText>
            </Badge>
          ) : null}
          {!search.trim() ? <SmallText style={{ marginTop: 10 }}>Showing the first 80 slots until you search.</SmallText> : null}
        </Card>

        {visibleResults.length === 0 ? (
          <EmptyState>
            <Heading>No stickers found</Heading>
          </EmptyState>
        ) : null}

        {visibleResults.map((slot) => {
          const quantity = getSlotQuantity(entryMap, slot.id);
          const duplicates = getDuplicateCount(quantity);

          return (
            <Card key={slot.id}>
              <RowBetween>
                <Heading>{slot.id}</Heading>
                <SlotActionRow>
                  <MiniAction onPress={() => removeSticker(album.id, slot.id)} $tone="remove">
                    <MiniActionText $tone="remove">-</MiniActionText>
                  </MiniAction>
                  <MiniAction onPress={() => addSticker(album.id, slot.id)}>
                    <MiniActionText>+</MiniActionText>
                  </MiniAction>
                  <MiniAction onPress={() => markMissing(album.id, slot.id)} $tone="missing">
                    <MiniActionText $tone="missing">0</MiniActionText>
                  </MiniAction>
                </SlotActionRow>
              </RowBetween>
              <Label>{slot.label}</Label>
              <Subtitle>
                {slot.groupName ?? slot.teamName ?? 'Specials'} · {slot.type} · {slot.verified ? 'verified' : 'placeholder'}
              </Subtitle>
              <SmallText>{quantity > 0 ? `Owned x${quantity}` : 'Missing'}</SmallText>
              {duplicates > 0 ? (
                <Badge $tone="warning" style={{ alignSelf: 'flex-start', marginTop: 10 }}>
                  <BadgeText>{duplicates} tradeable</BadgeText>
                </Badge>
              ) : null}
            </Card>
          );
        })}
      </ScrollContent>
    </Screen>
  );
};