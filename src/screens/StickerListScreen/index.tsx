import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components/native';

import {
  Badge,
  BadgeText,
  Button,
  ButtonText,
  Card,
  Chip,
  ChipRow,
  ChipText,
  Divider,
  EmptyState,
  GhostButton,
  GhostButtonText,
  Heading,
  Input,
  Label,
  MiniAction,
  MiniActionText,
  Row,
  RowBetween,
  Screen,
  ScrollContent,
  SlotActionRow,
  SmallText,
  Subtitle,
} from '../../components/ui';
import { useAlbums } from '../../context/AlbumsContext';
import type { StickerFilter, StickerSlot } from '../../models/types';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { buildEntryMap, getDuplicateCount, getSlotQuantity, matchesFilter, matchesSearch } from '../../utils/album';
import { SectionList, View } from 'react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'StickerList'>;

type StickerSection = {
  group: import('../../models/types').AlbumTemplateGroup;
  data: import('../../models/types').StickerSlot[];
};

const filters: StickerFilter[] = ['all', 'owned', 'missing', 'duplicates'];

interface StickerRowProps {
  $owned: boolean;
  $duplicate: boolean;
}

const StickerRow = styled.Pressable<StickerRowProps>`
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.radii.md}px;
  padding: ${(props) => props.theme.spacing.md}px;
  /* margin-bottom: ${(props) => props.theme.spacing.sm}px; */
  background-color: ${(props) => props.theme.colors.surface};
  
  background-color: ${(props) =>
		props.$duplicate
			? props.theme.colors.slotDuplicate
			: props.$owned
				? props.theme.colors.slotOwned
				: props.theme.colors.slotEmpty};
`;

export const StickerListScreen = ({ navigation, route }: Props) => {
  const { albumId } = route.params;
  const { getAlbumById, getTemplateById, getEntriesForAlbum, addSticker, removeSticker, markMissing } = useAlbums();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<StickerFilter>('all');
  const [registerMode, setRegisterMode] = useState(false);


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

  const sections = useMemo<StickerSection[]>(
    () =>
      template.groups
        .map((group) => ({
          group,
          data: template.slots.filter(
            (slot) =>
              slot.groupId === group.id &&
              matchesSearch(slot, search) &&
              matchesFilter(slot, entryMap, filter),
          ),
        }))
        .filter((section) => section.data.length > 0),
    [template, search, filter, entryMap],
  );

  const renderSectionHeader = useCallback(
    ({ section }: { section: StickerSection }) => (
      <View style={{ paddingVertical: 16 }}>
        <Row style={{ flex: 1, alignItems: 'flex-start' }}>
          {section.group.icon ? <Label style={{ marginRight: 8 }}>{section.group.icon}</Label> : null}
          <Label style={{ flex: 1, flexWrap: 'wrap', flexShrink: 1 }}>{section.group.name}</Label>
          <Badge style={{ marginLeft: 8 }}>
            <BadgeText>{section.data.length}</BadgeText>
          </Badge>
        </Row>
        <SmallText>
          {section.group.groupLetter ? `Group ${section.group.groupLetter}` : 'Special section'}
        </SmallText>
      </View>
    ),
    [],
  );

  const renderItem = useCallback(
    ({ item: slot }: { item: StickerSlot }) => {
      const quantity = getSlotQuantity(entryMap, slot.id);
      const duplicates = getDuplicateCount(quantity);

      return (
        <StickerRow
          onPress={() =>
            registerMode
              ? addSticker(album.id, slot.id)
              : navigation.navigate('RegisterSticker', {
                albumId: album.id,
                initialSlotId: slot.id,
              })
          }
          onLongPress={() => {
            if (registerMode)
              removeSticker(album.id, slot.id);
          }}
          style={{ borderRadius: 0, marginBottom: 0, borderTopWidth: 0 }}
          $owned={quantity > 0}
          $duplicate={duplicates > 0}
        >
          <RowBetween>
            <Row style={{ flex: 1 }}>
              <Heading style={{ fontSize: 16 }}>{slot.id}</Heading>
            </Row>
          </RowBetween>
          <Subtitle>{slot.label}</Subtitle>
          <RowBetween style={{ marginTop: 10 }}>
            <SmallText>
              {quantity > 0 ? `Owned x${quantity}` : 'Missing'} · {slot.type}
            </SmallText>
            {duplicates > 0 ? (
              <Badge $tone="warning">
                <BadgeText>+{duplicates} dup</BadgeText>
              </Badge>
            ) : null}
          </RowBetween>
        </StickerRow>
      );
    },
    [entryMap, registerMode, album.id, addSticker, removeSticker, markMissing, navigation],
  );

  const listHeader = (
    <Card>
      <Heading>{album.customName}</Heading>
      <Subtitle>Search by slot ID, team, player placeholder, group, country or sticker type.</Subtitle>
      <Input
        placeholder="Search stickers"
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
      <Row style={{ gap: 10 }}>
        <Button style={{ flex: 1 }} onPress={() => setRegisterMode((current) => !current)} $variant={registerMode ? 'secondary' : 'primary'}>
          <ButtonText>{registerMode ? 'Register mode on' : 'Register mode off'}</ButtonText>
        </Button>
        <GhostButton style={{ flex: 1 }} onPress={() => navigation.navigate('AlbumPages', { albumId })}>
          <GhostButtonText>Album view</GhostButtonText>
        </GhostButton>
      </Row>
    </Card>
  );

  return (
    <Screen>
      <SectionList
        sections={sections}
        keyExtractor={(slot) => slot.id}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        ListHeaderComponent={listHeader}
        extraData={{ entryMap, registerMode }}
        contentContainerStyle={{ padding: 16, paddingBottom: 56 }}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        // horizontal
      />
    </Screen>
  );
};