import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
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
	ProgressFill,
	ProgressRail,
	Row,
	RowBetween,
	Screen,
	ScrollContent,
	SmallText,
	Subtitle,
} from '../components/ui';
import { useAlbums } from '../context/AlbumsContext';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { buildEntryMap, calculateGroupStats, getDuplicateCount, getSlotQuantity } from '../utils/album';

type Props = NativeStackScreenProps<RootStackParamList, 'AlbumPages'>;

const Grid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const SlotTile = styled.Pressable<{ $owned: boolean; $duplicate: boolean }>`
  width: 31%;
  min-height: 82px;
  border-radius: ${(props) => props.theme.radii.md}px;
  background-color: ${(props) =>
		props.$duplicate
			? props.theme.colors.slotDuplicate
			: props.$owned
				? props.theme.colors.slotOwned
				: props.theme.colors.slotEmpty};
  padding: ${(props) => props.theme.spacing.sm}px;
  margin-bottom: ${(props) => props.theme.spacing.sm}px;
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.border};
`;

const InlineProgressRail = styled(ProgressRail)`
	flex: 1;
	height: 6px;
	margin-top: 0;
	margin-left: ${(props) => props.theme.spacing.sm}px;
	margin-right: ${(props) => props.theme.spacing.sm}px;
`;

const CollapseButton = styled(GhostButton)`
	padding-top: 6px;
	padding-bottom: 6px;
	padding-left: 10px;
	padding-right: 10px;
	min-width: 0;
`;

const CollapseButtonText = styled(GhostButtonText)`
	font-size: 20px;
	line-height: 20px;
`;

export const AlbumPagesScreen = ({ navigation, route }: Props) => {
	const { albumId } = route.params;
	const { getAlbumById, getTemplateById, getEntriesForAlbum, addSticker } = useAlbums();
	const [registerMode, setRegisterMode] = useState(false);
	const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

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

	return (
		<Screen>
			<ScrollContent>
				<Card>
					<Heading>{album.customName}</Heading>
					<Subtitle>Simulated album pages grouped into page-like grids. Tap any slot in register mode to add one.</Subtitle>
					<Row style={{ gap: 10, marginTop: 16 }}>
						<Button style={{ flex: 1 }} onPress={() => setRegisterMode((current) => !current)} $variant={registerMode ? 'secondary' : 'primary'}>
							<ButtonText>{registerMode ? 'Register mode on' : 'Register mode off'}</ButtonText>
						</Button>
						<GhostButton style={{ flex: 1 }} onPress={() => navigation.navigate('StickerList', { albumId })}>
							<GhostButtonText>List view</GhostButtonText>
						</GhostButton>
					</Row>
				</Card>

				{template.groups.map((group) => {
					const sectionSlots = template.slots.filter((slot) => slot.groupId === group.id);
					const groupStats = calculateGroupStats(sectionSlots, entryMap);
					const progressLabel = `${groupStats.ownedUnique}/${groupStats.totalSlots}${groupStats.duplicateCount > 0 ? `/${groupStats.duplicateCount}` : ''}`;
					const isCollapsed = collapsed[group.id] ?? true;

					return (
						<Card key={group.id}>
							<RowBetween>
								<Row style={{ flex: 1, alignItems: 'flex-start' }}>
									{group.icon ? <Heading style={{ marginRight: 8 }}>{group.icon}</Heading> : null}
									<Heading style={{ flex: 1, flexWrap: 'wrap', flexShrink: 1 }}>{group.name}</Heading>
								</Row>
								<CollapseButton
									accessibilityLabel={isCollapsed ? `Expand ${group.name}` : `Collapse ${group.name}`}
									onPress={() =>
										setCollapsed((current) => ({
											...current,
											[group.id]: !isCollapsed,
										}))
									}
								>
									<CollapseButtonText>{isCollapsed ? '▾' : '▴'}</CollapseButtonText>
								</CollapseButton>
							</RowBetween>
							<SmallText>{group.groupLetter ? `Group ${group.groupLetter}` : 'Special section'}</SmallText>
							<Row style={{ marginTop: 8, alignItems: 'center' }}>
								<SmallText>{progressLabel}</SmallText>
								<InlineProgressRail>
								<ProgressFill $width={groupStats.completionPercentage} />
								</InlineProgressRail>
							</Row>

							{!isCollapsed ? (
								// <Card style={{ backgroundColor: '#f8f2e2' }}>
								<>
									<Grid>
										{sectionSlots.map((slot) => {
											const quantity = getSlotQuantity(entryMap, slot.id);
											const duplicates = getDuplicateCount(quantity);

											return (
												<SlotTile
													key={slot.id}
													$owned={quantity > 0}
													$duplicate={duplicates > 0}
													onPress={() =>
														registerMode
															? addSticker(album.id, slot.id)
															: navigation.navigate('RegisterSticker', {
																albumId: album.id,
																initialSlotId: slot.id,
															})
													}
												>
													<SmallText>{slot.id}</SmallText>
													<Heading style={{ fontSize: 14 }}>{slot.label}</Heading>
													<SmallText>{quantity > 0 ? `x${quantity}` : 'empty'}</SmallText>
													{duplicates > 0 ? (
														<Badge $tone="warning" style={{ alignSelf: 'flex-start', marginTop: 6 }}>
															<BadgeText>+{duplicates}</BadgeText>
														</Badge>
													) : null}
												</SlotTile>
											);
										})}
									</Grid>
								</>
								// </Card>
							) : null}
						</Card>
					);
				})}
			</ScrollContent>
		</Screen>
	);
};