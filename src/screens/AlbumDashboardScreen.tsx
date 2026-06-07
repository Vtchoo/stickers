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
            <StatValue style={{ fontSize: 28 }}>{stats.ownedUnique} / {stats.totalSlots}</StatValue>
            <Subtitle>Owned / Total</Subtitle>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <View style={{ alignItems: 'center' }}>
              <Subtitle>Missing</Subtitle>
              <StatValue style={{ fontSize: undefined }}>{stats.missing}</StatValue>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Subtitle>Duplicates</Subtitle>
              <StatValue style={{ fontSize: undefined }}>{stats.duplicateCount}</StatValue>
            </View>
          </View>
        </View>

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

        <Card>
          <Heading>Section progress</Heading>
          {groupHighlights.map(({ group, stats: groupStats }) => (
            <Card key={group.id} style={{ marginBottom: 10 }}>
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
          ))}
        </Card>
      </ScrollContent>
    </Screen>
  );
};