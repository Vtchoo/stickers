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
  const groupHighlights = template.groups
    .slice(0, 8)
    .map((group) => ({
      group,
      stats: calculateGroupStats(
        template.slots.filter((slot) => slot.groupId === group.id),
        entryMap,
      ),
    }));

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

        <StatGrid>
          <StatCard>
            <Subtitle>Total slots</Subtitle>
            <StatValue>{stats.totalSlots}</StatValue>
          </StatCard>
          <StatCard>
            <Subtitle>Owned</Subtitle>
            <StatValue>{stats.ownedUnique}</StatValue>
          </StatCard>
          <StatCard>
            <Subtitle>Missing</Subtitle>
            <StatValue>{stats.missing}</StatValue>
          </StatCard>
          <StatCard>
            <Subtitle>Duplicates</Subtitle>
            <StatValue>{stats.duplicateCount}</StatValue>
          </StatCard>
        </StatGrid>

        <Card>
          <Heading>Workflows</Heading>
          <Subtitle>Switch between the list and album layouts, register new stickers, or jump straight to tradeables.</Subtitle>
          <Button style={{ marginTop: 16 }} onPress={() => navigation.navigate('StickerList', { albumId: album.id })}>
            <ButtonText>List view</ButtonText>
          </Button>
          <Button style={{ marginTop: 10 }} onPress={() => navigation.navigate('AlbumPages', { albumId: album.id })} $variant="secondary">
            <ButtonText>Album view</ButtonText>
          </Button>
          <Button style={{ marginTop: 10 }} onPress={() => navigation.navigate('RegisterSticker', { albumId: album.id })}>
            <ButtonText>Register stickers</ButtonText>
          </Button>
          <Button style={{ marginTop: 10 }} onPress={() => navigation.navigate('Duplicates', { albumId: album.id })} $variant="secondary">
            <ButtonText>Duplicates</ButtonText>
          </Button>
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