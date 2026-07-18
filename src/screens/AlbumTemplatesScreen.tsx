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
  const [albumName, setAlbumName] = useState<string>();

  return (
    <Screen>
      <ScrollContent>
        <Hero style={{ gap: 16 }}>
          <HeroTitle>Stickers</HeroTitle>
          <HeroText>
            Start personal albums from official templates, track owned stickers, and keep your duplicates ready for trades.
          </HeroText>
          <Row style={{ gap: 8 }}>
            <Badge>
              <BadgeText>{templates.length} template</BadgeText>
            </Badge>
            <Badge>
              <BadgeText>{userAlbums.length} albums</BadgeText>
            </Badge>
          </Row>
        </Hero>

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
            <Button style={{ flex: 1 }} onPress={() => navigation.navigate('MyAlbums')}>
              <GhostButtonText>My albums</GhostButtonText>
            </Button>

            <Label style={{ marginTop: 16 }}>New album</Label>
            <Row style={{ gap: 16 }}>
              <Input
                placeholder="Pick a name..."
                value={albumName}
                onChangeText={setAlbumName}
                placeholderTextColor="#7f8a92"
                style={{ flex: 1 }}
              />

              <Button
                onPress={() => {
                  if (!albumName || !albumName.trim()) {
                    return;
                  }
                  const album = createAlbum(template.id, albumName.trim() || 'My Album');
                  navigation.navigate('AlbumDashboard', { albumId: album.id });
                }}
                disabled={!isReady}
              >
                <ButtonText>New</ButtonText>
              </Button>
            </Row>
          </Card>
        ))}
      </ScrollContent>
    </Screen>
  );
};