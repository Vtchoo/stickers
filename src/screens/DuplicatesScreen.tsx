import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  Badge,
  BadgeText,
  Card,
  EmptyState,
  Heading,
  RowBetween,
  Screen,
  ScrollContent,
  SmallText,
  Subtitle,
} from '../components/ui';
import { useAlbums } from '../context/AlbumsContext';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { buildEntryMap, getDuplicateCount, getSlotQuantity } from '../utils/album';

type Props = NativeStackScreenProps<RootStackParamList, 'Duplicates'>;

export const DuplicatesScreen = ({ route }: Props) => {
  const { albumId } = route.params;
  const { getAlbumById, getTemplateById, getEntriesForAlbum } = useAlbums();

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
  const duplicates = template.slots
    .map((slot) => ({
      slot,
      quantity: getSlotQuantity(entryMap, slot.id),
    }))
    .filter((item) => item.quantity > 1);

  const totalTradeables = duplicates.reduce(
    (result, item) => result + getDuplicateCount(item.quantity),
    0,
  );

  return (
    <Screen>
      <ScrollContent>
        <Card>
          <Heading>{album.customName}</Heading>
          <Subtitle>
            {duplicates.length} duplicate slots · {totalTradeables} tradeable stickers
          </Subtitle>
        </Card>

        {duplicates.length === 0 ? (
          <EmptyState>
            <Heading>No duplicates yet</Heading>
            <Subtitle>Add the same sticker more than once and it will appear here.</Subtitle>
          </EmptyState>
        ) : null}

        {duplicates.map(({ slot, quantity }) => (
          <Card key={slot.id}>
            <RowBetween>
              <Heading>{slot.id}</Heading>
              <Badge $tone="warning">
                <BadgeText>+{getDuplicateCount(quantity)}</BadgeText>
              </Badge>
            </RowBetween>
            <Subtitle>{slot.label}</Subtitle>
            <SmallText>
              {slot.teamName ?? slot.groupName ?? 'Special'} · owned x{quantity}
            </SmallText>
          </Card>
        ))}
      </ScrollContent>
    </Screen>
  );
};