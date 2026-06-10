import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  Badge,
  BadgeText,
  Button,
  ButtonText,
  Card,
  Divider,
  Heading,
  Hero,
  HeroText,
  HeroTitle,
  ProgressFill,
  ProgressRail,
  Row,
  Screen,
  ScrollContent,
  StatCard,
  StatGrid,
  StatValue,
  Subtitle,
} from '../components/ui';
import { useAlbums } from '../context/AlbumsContext';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { buildEntryMap, calculateAlbumStats, calculateGroupStats, formatPercentage } from '../utils/album';
import { Text, View } from 'react-native';
import { useMemo } from 'react';
import { theme } from '../theme/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'AlbumDashboard'>;

export const AlbumDashboardScreen = ({ navigation, route }: Props) => {
  const { albumId } = route.params;
  const { getAlbumById, getEntriesForAlbum, getTemplateById } = useAlbums();

  const album = getAlbumById(albumId);

  if (!album) {
    return (
      <Screen>
        <ScrollContent>
          <Card>
            <Heading>Album not found</Heading>
          </Card>
        </ScrollContent>
      </Screen>
    );
  }

  const template = getTemplateById(album.templateId);

  if (!template) {
    return (
      <Screen>
        <ScrollContent>
          <Card>
            <Heading>Template not found</Heading>
          </Card>
        </ScrollContent>
      </Screen>
    );
  }

  const entryMap = buildEntryMap(getEntriesForAlbum(album.id));
  const stats = calculateAlbumStats(template, entryMap);
  const groupHighlights = useMemo(() => template.groups
    .map((group) => ({
      group,
      stats: calculateGroupStats(
        template.slots.filter((slot) => slot.groupId === group.id),
        entryMap,
      ),
    }))
    .sort((a, b) => b.stats.completionPercentage - a.stats.completionPercentage)
    .slice(0, 8), [template, entryMap]);

  return (
    <Screen>
      <ScrollContent>
        <Hero>
          <HeroTitle>{album.customName}</HeroTitle>
          <HeroText>{template.name}</HeroText>
          <ProgressRail>
            <ProgressFill $width={stats.completionPercentage} />
          </ProgressRail>
          <Badge style={{ marginTop: 14, alignSelf: 'flex-start' }}>
            <BadgeText>{formatPercentage(stats.completionPercentage)} complete</BadgeText>
          </Badge>
        </Hero>

        <View style={{ gap: 8 }}>
          <View style={{ flexDirection: 'column', alignItems: 'center' }}>
            <StatValue style={{ fontSize: 28 }}>{stats.ownedRequired} / {stats.totalSlots}</StatValue>
            <Subtitle>Owned / Total</Subtitle>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ alignItems: 'center', flex: 1 }}>
              <Subtitle>Missing</Subtitle>
              <StatValue style={{ fontSize: undefined }}>{stats.missing}</StatValue>
            </View>
            <View style={{ alignItems: 'center', flex: 1 }}>
              <Subtitle>Duplicates</Subtitle>
              <StatValue style={{ fontSize: undefined }}>{stats.duplicateCount}</StatValue>
            </View>
            {stats.extras > 0 ? (
              <View style={{ alignItems: 'center', flex: 1 }}>
                <Subtitle>Extras 😎</Subtitle>
                <StatValue style={{ fontSize: undefined }}>{stats.extras}</StatValue>
              </View>
            ) : null}
          </View>
        </View>

        <View style={{ gap: theme.spacing.sm }}>
          <Button onPress={() => navigation.navigate('RegisterSticker', { albumId: album.id })}>
            <ButtonText>Register stickers</ButtonText>
          </Button>
          <Button onPress={() => navigation.navigate('Duplicates', { albumId: album.id })} $variant="secondary">
            <ButtonText>Duplicates</ButtonText>
          </Button>
          <Button onPress={() => navigation.navigate('AlbumPages', { albumId: album.id })} $variant="secondary">
            <ButtonText>Album view</ButtonText>
          </Button>
          <Button onPress={() => navigation.navigate('StickerList', { albumId: album.id })} $variant="secondary">
            <ButtonText>List view</ButtonText>
          </Button>
        </View>

        <Card>
          <Heading>Progress</Heading>
          {groupHighlights.map(({ group, stats: groupStats }) => {
            const requiredComplete = groupStats.totalSlots > 0 && groupStats.ownedRequired >= groupStats.totalSlots;
            const hasExtras = groupStats.ownedUnique > groupStats.ownedRequired;
            const borderColor = requiredComplete
              ? hasExtras ? '#2f95a0' : '#3fa86a'
              : undefined;

            return (
              <Card key={group.id} style={{ marginBottom: 10, ...(borderColor ? { borderColor, borderWidth: 2 } : {}) }}>
                <Row style={{ alignItems: 'flex-start' }}>
                  {group.icon ? <Heading style={{ marginRight: 8 }}>{group.icon}</Heading> : null}
                  <Heading style={{ flex: 1, flexWrap: 'wrap', flexShrink: 1 }}>{group.name}</Heading>
                </Row>
                <Subtitle>
                  {group.groupLetter ? `Group ${group.groupLetter}` : 'Special section'} · {groupStats.ownedUnique}/{groupStats.totalSlots} owned
                </Subtitle>
                <ProgressRail>
                  <ProgressFill $width={groupStats.completionPercentage} />
                </ProgressRail>
              </Card>
            );
          })}
        </Card>

        <Card>
          <Heading>Seed notes</Heading>
          {template.sourceSummary.verified.map((item) => (
            <Subtitle key={item}>• {item}</Subtitle>
          ))}
          <Divider />
          {template.sourceSummary.placeholder.map((item) => (
            <Subtitle key={item}>• {item}</Subtitle>
          ))}
        </Card>
      </ScrollContent>
    </Screen>
  );
};