import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Clipboard from 'expo-clipboard';
import { useState } from 'react';
import { Alert, Modal, Pressable } from 'react-native';
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
  Input,
  Label,
  ProgressFill,
  ProgressRail,
  Row,
  RowBetween,
  Screen,
  ScrollContent,
  SmallText,
  Subtitle,
  TextButton,
} from '../components/ui';
import { useAlbums } from '../context/AlbumsContext';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { buildEntryMap, calculateAlbumStats, formatPercentage } from '../utils/album';
import { theme } from '../theme/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'MyAlbums'>;

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
  background-color: rgba(15, 20, 28, 0.93);
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

const ImportInput = styled(Input)`
  height: 220px;
  max-height: 220px;
  width: 100%;
  text-align-vertical: top;
`;

export const MyAlbumsScreen = ({ navigation }: Props) => {
  const { userAlbums, getTemplateById, getEntriesForAlbum, exportAlbum, importAlbum, updateAlbumFromImport, deleteAlbum } = useAlbums();
  const [isImportVisible, setIsImportVisible] = useState(false);
  const [importValue, setImportValue] = useState('');
  const [albumIdToUpdate, setAlbumIdToUpdate] = useState<string | null>(null);
  const [albumToDelete, setAlbumToDelete] = useState<{ id: string; name: string } | null>(null);

  const closeImportModal = () => {
    setImportValue('');
    setAlbumIdToUpdate(null);
    setIsImportVisible(false);
  };

  const openImportModal = (targetAlbumId?: string) => {
    setImportValue('');
    setAlbumIdToUpdate(targetAlbumId ?? null);
    setIsImportVisible(true);
  };

  const handleExport = async (albumId: string) => {
    try {
      await Clipboard.setStringAsync(exportAlbum(albumId));
      Alert.alert('Album exported', 'The album JSON has been copied to the clipboard.');
    } catch (error) {
      Alert.alert('Export failed', error instanceof Error ? error.message : 'Unable to export this album.');
    }
  };

  const handleImport = () => {
    try {
      if (albumIdToUpdate) {
        const updatedAlbum = updateAlbumFromImport(albumIdToUpdate, importValue);
        closeImportModal();
        Alert.alert('Album updated', `${updatedAlbum.customName} was replaced with the pasted JSON.`);
        navigation.navigate('AlbumDashboard', { albumId: updatedAlbum.id });
        return;
      }

      const importedAlbum = importAlbum(importValue);
      closeImportModal();
      Alert.alert('Album imported', `${importedAlbum.customName} is now available in My Albums.`);
      navigation.navigate('AlbumDashboard', { albumId: importedAlbum.id });
    } catch (error) {
      Alert.alert(
        albumIdToUpdate ? 'Album update failed' : 'Import failed',
        error instanceof Error ? error.message : 'Unable to process this album JSON.',
      );
    }
  };

  return (
    <Screen>
      <ScrollContent>
        <Card>
          <Heading>Transfer albums</Heading>
          <Subtitle>Export copies an album JSON snapshot to the clipboard. Import creates a new local album from pasted JSON.</Subtitle>
          <Button style={{ marginTop: 16 }} onPress={() => openImportModal()}>
            <ButtonText>Import album JSON</ButtonText>
          </Button>
        </Card>

        {userAlbums.length === 0 ? (
          <EmptyState>
            <Heading>No albums yet</Heading>
            <Subtitle>Create a personal album from the home screen to start tracking.</Subtitle>
          </EmptyState>
        ) : null}

        {userAlbums.map((album) => {
          const template = getTemplateById(album.templateId);

          if (!template) {
            return null;
          }

          const stats = calculateAlbumStats(template, buildEntryMap(getEntriesForAlbum(album.id)));

          return (
            <Card key={album.id}>
              <RowBetween>
                <Heading>{album.customName}</Heading>
                <Badge>
                  <BadgeText>{formatPercentage(stats.completionPercentage)}</BadgeText>
                </Badge>
              </RowBetween>
              <Subtitle>{template.name}</Subtitle>
              <SmallText>{new Date(album.createdAt).toLocaleString()}</SmallText>
              <ProgressRail>
                <ProgressFill $width={stats.completionPercentage} />
              </ProgressRail>
              <Row style={{ marginTop: 12, justifyContent: 'space-between' }}>
                <SmallText>{stats.ownedUnique} owned</SmallText>
                <SmallText>{stats.missing} missing</SmallText>
                <SmallText>{stats.duplicateCount} duplicates</SmallText>
              </Row>
              <Row style={{ marginTop: 16, gap: 10 }}>
                <Button style={{ flex: 1 }} onPress={() => navigation.navigate('AlbumDashboard', { albumId: album.id })}>
                  <ButtonText>Open</ButtonText>
                </Button>
                <Button style={{ flex: 1 }} onPress={() => navigation.navigate('Duplicates', { albumId: album.id })} $variant="secondary">
                  <ButtonText>Trade list</ButtonText>
                </Button>
              </Row>
              <GhostButton onPress={() => void handleExport(album.id)}>
                <GhostButtonText>Export JSON</GhostButtonText>
              </GhostButton>
              <GhostButton onPress={() => openImportModal(album.id)}>
                <GhostButtonText>Update from JSON</GhostButtonText>
              </GhostButton>
              <TextButton $variant="danger" onPress={() => setAlbumToDelete({ id: album.id, name: album.customName })}>
                <ButtonText style={{ color: theme.colors.danger }}>Delete album</ButtonText>
              </TextButton>
            </Card>
          );
        })}

        <Modal visible={albumToDelete !== null} transparent animationType="fade" onRequestClose={() => setAlbumToDelete(null)}>
          <ModalLayer>
            <ModalBackdrop onPress={() => setAlbumToDelete(null)} />
            <ModalCenter pointerEvents="box-none">
              <ModalCard>
                <Heading>Delete album?</Heading>
                <Subtitle style={{ marginTop: 8 }}>
                  {`"${albumToDelete?.name}" and all its sticker data will be permanently removed. This cannot be undone.`}
                </Subtitle>
                <ModalFooter>
                  <Row style={{ gap: 10 }}>
                    <GhostButton style={{ flex: 1 }} onPress={() => setAlbumToDelete(null)}>
                      <GhostButtonText>Cancel</GhostButtonText>
                    </GhostButton>
                    <Button
                      style={{ flex: 1 }}
                      $variant="danger"
                      onPress={() => {
                        if (albumToDelete) {
                          deleteAlbum(albumToDelete.id);
                          setAlbumToDelete(null);
                        }
                      }}
                    >
                      <ButtonText>Delete</ButtonText>
                    </Button>
                  </Row>
                </ModalFooter>
              </ModalCard>
            </ModalCenter>
          </ModalLayer>
        </Modal>

        <Modal visible={isImportVisible} transparent animationType="fade" onRequestClose={closeImportModal}>
          <ModalLayer>
            <ModalBackdrop onPress={closeImportModal} />
            <ModalCenter pointerEvents="box-none">
              <ModalCard>
                <ModalContent>
                  <Heading>{albumIdToUpdate ? 'Update album' : 'Import album'}</Heading>
                  <Subtitle>
                    {albumIdToUpdate
                      ? 'Paste a previously exported album JSON payload. This will replace the selected album data with the pasted snapshot.'
                      : 'Paste a previously exported album JSON payload. Import creates a new album and keeps your existing albums untouched.'}
                  </Subtitle>
                  <Label style={{ marginTop: 16 }}>Album JSON</Label>
                  <ImportInput
                    value={importValue}
                    onChangeText={setImportValue}
                    multiline
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder="Paste album JSON here"
                    placeholderTextColor="#8a8578"
                  />
                </ModalContent>
                <ModalFooter>
                  <Row style={{ gap: 10 }}>
                    <GhostButton style={{ flex: 1 }} onPress={closeImportModal}>
                      <GhostButtonText>Cancel</GhostButtonText>
                    </GhostButton>
                    <Button style={{ flex: 1 }} onPress={handleImport}>
                      <ButtonText>{albumIdToUpdate ? 'Update album' : 'Import'}</ButtonText>
                    </Button>
                  </Row>
                </ModalFooter>
              </ModalCard>
            </ModalCenter>
          </ModalLayer>
        </Modal>
      </ScrollContent>
    </Screen>
  );
};