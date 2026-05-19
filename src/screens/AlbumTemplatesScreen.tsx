import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import styled from 'styled-components/native';

import {
  Badge,
  BadgeText,
  Button,
  ButtonText,
  Card,
  GhostButton,
  GhostButtonText,
  Heading,
  Hero,
  HeroText,
  HeroTitle,
  Input,
  Label,
  Row,
  RowBetween,
  Screen,
  ScrollContent,
  SmallText,
  Subtitle,
} from '../components/ui';
import { useAlbums } from '../context/AlbumsContext';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'AlbumTemplates'>;

const ListItem = styled.Text`
  color: ${(props) => props.theme.colors.textMuted};
  font-size: 13px;
  line-height: 19px;
  margin-top: 4px;
`;

export const AlbumTemplatesScreen = ({ navigation }: Props) => {
  const { templates, createAlbum, isReady, userAlbums } = useAlbums();
  const [albumName, setAlbumName] = useState('My Album');

  return (
    <Screen>
      <ScrollContent>
        <Hero>
          <HeroTitle>Sticker Album Manager</HeroTitle>
          <HeroText>
            Start personal albums from official templates, track owned stickers, and keep your duplicates ready for trades.
          </HeroText>
          <Row style={{ marginTop: 14 }}>
            <Badge>
              <BadgeText>{templates.length} template</BadgeText>
            </Badge>
            <Row style={{ width: 8 }} />
            <Badge>
              <BadgeText>{userAlbums.length} albums</BadgeText>
            </Badge>
          </Row>
        </Hero>

        <Card>
          <Heading>Available templates</Heading>
          <Subtitle>
            The first seed uses FIFA World Cup 2026 data with verified tournament groups and stadiums, plus placeholder slot IDs where the physical checklist is incomplete.
          </Subtitle>
        </Card>

        {templates.map((template) => (
          <Card key={template.id}>
            <RowBetween>
              <Heading>{template.name}</Heading>
              <Badge>
                <BadgeText>{template.year}</BadgeText>
              </Badge>
            </RowBetween>
            <Subtitle>
              {template.publisher} · {template.groups.filter((group) => group.section === 'team').length} team sections · {template.slots.length} total seeded slots
            </Subtitle>

            <Label style={{ marginTop: 16 }}>Album name</Label>
            <Input
              placeholder="My Album"
              value={albumName}
              onChangeText={setAlbumName}
              placeholderTextColor="#7f8a92"
            />

            <Row style={{ marginTop: 16, gap: 10 }}>
              <Button
                style={{ flex: 1 }}
                onPress={() => {
                  const album = createAlbum(template.id, albumName.trim() || 'My Album');
                  navigation.navigate('AlbumDashboard', { albumId: album.id });
                }}
                disabled={!isReady}
              >
                <ButtonText>Create album</ButtonText>
              </Button>
              <GhostButton style={{ flex: 1 }} onPress={() => navigation.navigate('MyAlbums')}>
                <GhostButtonText>My albums</GhostButtonText>
              </GhostButton>
            </Row>

            <Label style={{ marginTop: 18 }}>Verified</Label>
            {template.sourceSummary.verified.map((item) => (
              <ListItem key={item}>• {item}</ListItem>
            ))}

            <Label style={{ marginTop: 18 }}>Placeholders in this MVP</Label>
            {template.sourceSummary.placeholder.map((item) => (
              <ListItem key={item}>• {item}</ListItem>
            ))}

            <SmallText style={{ marginTop: 18 }}>
              Official sources: {template.sourceSummary.officialSources.join(' · ')}
            </SmallText>
          </Card>
        ))}
      </ScrollContent>
    </Screen>
  );
};