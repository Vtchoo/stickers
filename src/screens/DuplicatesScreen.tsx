import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { Alert, Modal, Pressable, Share } from 'react-native';
import styled from 'styled-components/native';

import {
  Badge,
  BadgeText,
  Button,
  ButtonText,
  Card,
  EmptyState,
  GhostButton,
  GhostButtonText,
  Heading,
  MiniAction,
  MiniActionText,
  RowBetween,
  Screen,
  ScrollContent,
  SmallText,
  Subtitle,
} from '../components/ui';
import { useAlbums } from '../context/AlbumsContext';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { buildEntryMap, getDuplicateCount, getSlotQuantity } from '../utils/album';
import { buildDuplicatesShareText, buildMissingShareText } from '../utils/shareText';

type Props = NativeStackScreenProps<RootStackParamList, 'Duplicates'>;

const ModalLayer = styled.View`
  flex: 1;
  justify-content: center;
  padding: 20px;
`;

const ModalBackdrop = styled(Pressable)`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(15, 20, 28, 0.52);
`;

const ModalCenter = styled.View`
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const ModalCard = styled.View`
  width: 100%;
  max-height: 86%;
  background-color: ${(props) => props.theme.colors.card};
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.radii.lg}px;
  padding: ${(props) => props.theme.spacing.md}px;
`;

const ModalContent = styled.ScrollView.attrs({
  showsVerticalScrollIndicator: false,
  bounces: false,
})`
  flex-grow: 1;
`;

const ModalFooter = styled.View`
  margin-top: ${(props) => props.theme.spacing.md}px;
`;

const CounterRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const CounterValue = styled(Heading)`
  min-width: 28px;
  text-align: center;
  font-size: 18px;
`;

export const DuplicatesScreen = ({ route }: Props) => {
  const { albumId } = route.params;
  const { getAlbumById, getTemplateById, getEntriesForAlbum, settleTrade } = useAlbums();
  const [isSettleVisible, setIsSettleVisible] = useState(false);
  const [keptBack, setKeptBack] = useState<Record<string, number>>({});

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

  const returnedCount = useMemo(
    () => duplicates.reduce((result, item) => result + (keptBack[item.slot.id] ?? 0), 0),
    [duplicates, keptBack],
  );

  const givenAwayCount = totalTradeables - returnedCount;

  const missingSlots = template.slots.filter(
    (slot) => slot.required && getSlotQuantity(entryMap, slot.id) === 0,
  );

  const handleShare = async () => {
    try {
      await Share.share({
        message: buildMissingShareText(album.customName, missingSlots),
      });
    } catch (error) {
      Alert.alert('Share failed', error instanceof Error ? error.message : 'Unable to share.');
    }
  };

  const handleShareDuplicates = async () => {
    try {
      await Share.share({
        message: buildDuplicatesShareText(album.customName, duplicates),
      });
    } catch (error) {
      Alert.alert('Share failed', error instanceof Error ? error.message : 'Unable to share.');
    }
  };

  const openSettleTrade = () => {
    setKeptBack(
      Object.fromEntries(duplicates.map((item) => [item.slot.id, 0])),
    );
    setIsSettleVisible(true);
  };

  const updateKeptBack = (slotId: string, nextValue: number, maxValue: number) => {
    setKeptBack((current) => ({
      ...current,
      [slotId]: Math.max(0, Math.min(nextValue, maxValue)),
    }));
  };

  const confirmSettleTrade = () => {
    try {
      const trades = duplicates
        .map((item) => ({
          slotId: item.slot.id,
          givenAway: getDuplicateCount(item.quantity) - (keptBack[item.slot.id] ?? 0),
        }))
        .filter((trade) => trade.givenAway > 0);

      settleTrade(album.id, trades);
      setIsSettleVisible(false);
      setKeptBack({});
      Alert.alert('Trade settled', `${givenAwayCount} duplicate stickers were removed from the album.`);
    } catch (error) {
      Alert.alert('Trade settlement failed', error instanceof Error ? error.message : 'Unable to settle this trade.');
    }
  };

  return (
    <Screen>
      <ScrollContent>
        <Card>
          <Heading>{album.customName}</Heading>
          <Subtitle>
            {duplicates.length} duplicate slots · {totalTradeables} tradeable stickers
          </Subtitle>
          {duplicates.length > 0 ? (
            <Button style={{ marginTop: 8 }} onPress={openSettleTrade}>
              <ButtonText>Settle trade</ButtonText>
            </Button>
          ) : null}
          <GhostButton style={{ marginTop: 8 }} onPress={() => void handleShare()}>
            <GhostButtonText>Share missing</GhostButtonText>
          </GhostButton>
          <GhostButton style={{ marginTop: 8 }} onPress={() => void handleShareDuplicates()}>
            <GhostButtonText>Share duplicates</GhostButtonText>
          </GhostButton>
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

        <Modal visible={isSettleVisible} transparent animationType="fade" onRequestClose={() => setIsSettleVisible(false)}>
          <ModalLayer>
            <ModalBackdrop onPress={() => setIsSettleVisible(false)} />
            <ModalCenter pointerEvents="box-none">
              <ModalCard>
                <ModalContent>
                  <Heading>Settle trade</Heading>
                  <Subtitle>
                    Start from the assumption that you gave away every duplicate. Only count the stickers that came back to you.
                  </Subtitle>
                  <SmallText>
                    Format: tradeable duplicates {'->'} kept back after the trade.
                  </SmallText>

                  {duplicates.map(({ slot, quantity }) => {
                    const tradeableCount = getDuplicateCount(quantity);
                    const keptBackCount = keptBack[slot.id] ?? 0;

                    return (
                      <Card key={`settle-${slot.id}`}>
                        <RowBetween>
                          <Heading>{slot.id}</Heading>
                          <Badge $tone="warning">
                            <BadgeText>tradeable x{tradeableCount}</BadgeText>
                          </Badge>
                        </RowBetween>
                        <Subtitle>{slot.label}</Subtitle>
                        <SmallText>{slot.teamName ?? slot.groupName ?? 'Special'} · owned x{quantity}</SmallText>
                        <RowBetween>
                          <SmallText>Returned to you</SmallText>
                          <CounterRow>
                            <MiniAction
                              onPress={() => updateKeptBack(slot.id, keptBackCount - 1, tradeableCount)}
                              $tone="remove"
                            >
                              <MiniActionText $tone="remove">-</MiniActionText>
                            </MiniAction>
                            <CounterValue>{keptBackCount}</CounterValue>
                            <MiniAction
                              onPress={() => updateKeptBack(slot.id, keptBackCount + 1, tradeableCount)}
                              $tone="add"
                            >
                              <MiniActionText>+</MiniActionText>
                            </MiniAction>
                          </CounterRow>
                        </RowBetween>
                      </Card>
                    );
                  })}
                </ModalContent>
                <ModalFooter>
                  <Card>
                    <SmallText>
                      Will remove {givenAwayCount} duplicate stickers from the app. Returned pile: {returnedCount}.
                    </SmallText>
                  </Card>
                  <RowBetween style={{ gap: 10 }}>
                    <GhostButton style={{ flex: 1 }} onPress={() => setIsSettleVisible(false)}>
                      <GhostButtonText>Cancel</GhostButtonText>
                    </GhostButton>
                    <Button style={{ flex: 1 }} onPress={confirmSettleTrade}>
                      <ButtonText>Confirm trade</ButtonText>
                    </Button>
                  </RowBetween>
                </ModalFooter>
              </ModalCard>
            </ModalCenter>
          </ModalLayer>
        </Modal>
      </ScrollContent>
    </Screen>
  );
};