import type { AlbumTemplate, AlbumTemplateGroup, StickerSlot, StickerType } from '../models/types';

import { fifa2026ChecklistRows } from './fifa2026Checklist';

type TeamDefinition = {
  id: string;
  name: string;
  icon: string;
  code: string;
  groupLetter: string;
  color: string;
  aliases?: string[];
};

type ChecklistRow = (typeof fifa2026ChecklistRows)[number];

const palette = ['#D95D39', '#0F6D74', '#2F8F53', '#C48A1E', '#B2575E', '#4C78A8'];

const officialTeams: TeamDefinition[] = [
  { id: 'MEX', name: 'Mexico', icon: '🇲🇽', code: 'mex', groupLetter: 'A', color: palette[0] },
  { id: 'RSA', name: 'South Africa', icon: '🇿🇦', code: 'rsa', groupLetter: 'A', color: palette[1] },
  { id: 'KOR', name: 'South Korea', icon: '🇰🇷', code: 'kor', groupLetter: 'A', color: palette[2], aliases: ['Korea Republic'] },
  { id: 'CZE', name: 'Czechia', icon: '🇨🇿', code: 'cze', groupLetter: 'A', color: palette[3] },
  { id: 'CAN', name: 'Canada', icon: '🇨🇦', code: 'can', groupLetter: 'B', color: palette[1] },
  { id: 'BIH', name: 'Bosnia and Herzegovina', icon: '🇧🇦', code: 'bih', groupLetter: 'B', color: palette[2] },
  { id: 'QAT', name: 'Qatar', icon: '🇶🇦', code: 'qat', groupLetter: 'B', color: palette[3] },
  { id: 'SUI', name: 'Switzerland', icon: '🇨🇭', code: 'sui', groupLetter: 'B', color: palette[4] },
  { id: 'BRA', name: 'Brazil', icon: '🇧🇷', code: 'bra', groupLetter: 'C', color: palette[2] },
  { id: 'MAR', name: 'Morocco', icon: '🇲🇦', code: 'mar', groupLetter: 'C', color: palette[3] },
  { id: 'HAI', name: 'Haiti', icon: '🇭🇹', code: 'hai', groupLetter: 'C', color: palette[4] },
  { id: 'SCO', name: 'Scotland', icon: '🏴', code: 'sco', groupLetter: 'C', color: palette[5] },
  { id: 'USA', name: 'USA', icon: '🇺🇸', code: 'usa', groupLetter: 'D', color: palette[3], aliases: ['United States'] },
  { id: 'PAR', name: 'Paraguay', icon: '🇵🇾', code: 'par', groupLetter: 'D', color: palette[4] },
  { id: 'AUS', name: 'Australia', icon: '🇦🇺', code: 'aus', groupLetter: 'D', color: palette[5] },
  { id: 'TUR', name: 'Türkiye', icon: '🇹🇷', code: 'tur', groupLetter: 'D', color: palette[0], aliases: ['Turkiye'] },
  { id: 'GER', name: 'Germany', icon: '🇩🇪', code: 'ger', groupLetter: 'E', color: palette[4] },
  { id: 'CUW', name: 'Curaçao', icon: '🇨🇼', code: 'cuw', groupLetter: 'E', color: palette[5], aliases: ['Curacao'] },
  { id: 'CIV', name: 'Ivory Coast', icon: '🇨🇮', code: 'civ', groupLetter: 'E', color: palette[0], aliases: ["Cote d'Ivoire"] },
  { id: 'ECU', name: 'Ecuador', icon: '🇪🇨', code: 'ecu', groupLetter: 'E', color: palette[1] },
  { id: 'NED', name: 'Netherlands', icon: '🇳🇱', code: 'ned', groupLetter: 'F', color: palette[5] },
  { id: 'JPN', name: 'Japan', icon: '🇯🇵', code: 'jpn', groupLetter: 'F', color: palette[0] },
  { id: 'SWE', name: 'Sweden', icon: '🇸🇪', code: 'swe', groupLetter: 'F', color: palette[1] },
  { id: 'TUN', name: 'Tunisia', icon: '🇹🇳', code: 'tun', groupLetter: 'F', color: palette[2] },
  { id: 'BEL', name: 'Belgium', icon: '🇧🇪', code: 'bel', groupLetter: 'G', color: palette[0] },
  { id: 'EGY', name: 'Egypt', icon: '🇪🇬', code: 'egy', groupLetter: 'G', color: palette[1] },
  { id: 'IRN', name: 'Iran', icon: '🇮🇷', code: 'irn', groupLetter: 'G', color: palette[2], aliases: ['IR Iran'] },
  { id: 'NZL', name: 'New Zealand', icon: '🇳🇿', code: 'nzl', groupLetter: 'G', color: palette[3] },
  { id: 'ESP', name: 'Spain', icon: '🇪🇸', code: 'esp', groupLetter: 'H', color: palette[1] },
  { id: 'CPV', name: 'Cape Verde', icon: '🇨🇻', code: 'cpv', groupLetter: 'H', color: palette[2], aliases: ['Cabo Verde'] },
  { id: 'KSA', name: 'Saudi Arabia', icon: '🇸🇦', code: 'ksa', groupLetter: 'H', color: palette[3] },
  { id: 'URU', name: 'Uruguay', icon: '🇺🇾', code: 'uru', groupLetter: 'H', color: palette[4] },
  { id: 'FRA', name: 'France', icon: '🇫🇷', code: 'fra', groupLetter: 'I', color: palette[2] },
  { id: 'SEN', name: 'Senegal', icon: '🇸🇳', code: 'sen', groupLetter: 'I', color: palette[3] },
  { id: 'IRQ', name: 'Iraq', icon: '🇮🇶', code: 'irq', groupLetter: 'I', color: palette[4] },
  { id: 'NOR', name: 'Norway', icon: '🇳🇴', code: 'nor', groupLetter: 'I', color: palette[5] },
  { id: 'ARG', name: 'Argentina', icon: '🇦🇷', code: 'arg', groupLetter: 'J', color: palette[3] },
  { id: 'ALG', name: 'Algeria', icon: '🇩🇿', code: 'alg', groupLetter: 'J', color: palette[4] },
  { id: 'AUT', name: 'Austria', icon: '🇦🇹', code: 'aut', groupLetter: 'J', color: palette[5] },
  { id: 'JOR', name: 'Jordan', icon: '🇯🇴', code: 'jor', groupLetter: 'J', color: palette[0] },
  { id: 'POR', name: 'Portugal', icon: '🇵🇹', code: 'por', groupLetter: 'K', color: palette[4] },
  { id: 'COD', name: 'Congo DR', icon: '🇨🇩', code: 'cod', groupLetter: 'K', color: palette[5] },
  { id: 'UZB', name: 'Uzbekistan', icon: '🇺🇿', code: 'uzb', groupLetter: 'K', color: palette[0] },
  { id: 'COL', name: 'Colombia', icon: '🇨🇴', code: 'col', groupLetter: 'K', color: palette[1] },
  { id: 'ENG', name: 'England', icon: '🏴', code: 'eng', groupLetter: 'L', color: palette[5] },
  { id: 'CRO', name: 'Croatia', icon: '🇭🇷', code: 'cro', groupLetter: 'L', color: palette[0] },
  { id: 'GHA', name: 'Ghana', icon: '🇬🇭', code: 'gha', groupLetter: 'L', color: palette[1] },
  { id: 'PAN', name: 'Panama', icon: '🇵🇦', code: 'pan', groupLetter: 'L', color: palette[2] },
];

const specialGroupIcons: Record<string, string> = {
  'FIFA World Cup 2026': '🏆',
  'Host Countries and Cities': '🌎',
  'FIFA World Cup History': '📖',
  'We Are Panini': '🟦',
  "McDonald's Exclusive": '🍟',
  'Coca Cola / USA Canada': '🥤',
  'Coca Cola / Latin America': '🥤',
  'Coca Cola / Rest of the World': '🥤',
  'Coca Cola / Europe': '🥤',
  'Extra / Base': '✨',
  'Extra / Bronze': '🥉',
  'Extra / Silver': '🥈',
  'Extra / Gold': '🥇',
};

const communitySpecialOrder = [
  'FIFA World Cup 2026',
  'Host Countries and Cities',
  'FIFA World Cup History',
  'We Are Panini',
  "McDonald's Exclusive",
  'Coca Cola / USA Canada',
  'Coca Cola / Latin America',
  'Coca Cola / Rest of the World',
  'Coca Cola / Europe',
  'Extra / Base',
  'Extra / Bronze',
  'Extra / Silver',
  'Extra / Gold',
];

const searchable = (parts: Array<string | undefined>) =>
  parts
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

const teamGroupId = (team: TeamDefinition) => team.id.toLowerCase();

const teamByName = new Map<string, TeamDefinition>();
const teamById = new Map<string, TeamDefinition>();

officialTeams.forEach((team) => {
  teamByName.set(team.name, team);
  teamById.set(team.id, team);
  team.aliases?.forEach((alias) => teamByName.set(alias, team));
});

const resolveTeamForRow = (row: ChecklistRow) => {
  const teamId = row.id.match(/^[A-Z]+/)?.[0];

  if (teamId) {
    const matchedTeam = teamById.get(teamId);

    if (matchedTeam) {
      return matchedTeam;
    }
  }
};

const specialGroupNameForRow = (row: ChecklistRow) => {
  if (row.type.startsWith('Coca Cola /') || row.type.startsWith('Extra /')) {
    return row.type;
  }

  if (row.type === "McDonald's Exclusive") {
    return row.type;
  }

  return row.section;
};

const groupIdForName = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();

const slotTypeForRow = (row: ChecklistRow): StickerType => {
  if (row.section === 'Host Countries and Cities') {
    return 'special';
  }

  if (row.section === 'FIFA World Cup 2026' || row.section === 'FIFA World Cup History' || row.section === 'We Are Panini') {
    return 'special';
  }

  if (row.type.startsWith('Coca Cola /') || row.type.startsWith('Extra /') || row.type === "McDonald's Exclusive") {
    return 'special';
  }

  if (row.title === 'Emblem') {
    return 'team_logo';
  }

  if (row.title === 'Team Photo') {
    return 'other';
  }

  return 'player';
};

const groups: AlbumTemplateGroup[] = [];

officialTeams.forEach((team, sortOrder) => {
  groups.push({
    id: teamGroupId(team),
    name: team.name,
    icon: team.icon,
    section: 'team',
    groupLetter: team.groupLetter,
    teamCode: team.code,
    teamName: team.name,
    color: team.color,
    sortOrder,
    verified: true,
    note: 'Group ordering is verified against FIFA World Cup 2026 official tournament groups.',
  });
});

communitySpecialOrder.forEach((name, index) => {
  groups.push({
    id: groupIdForName(name),
    name,
    icon: specialGroupIcons[name],
    section: 'special',
    color: palette[(index + 1) % palette.length],
    sortOrder: officialTeams.length + index,
    verified: false,
    note: 'Checklist section sourced from the LastSticker community checklist rather than an official Panini checklist export.',
  });
});

const existingGroupIds = new Set(groups.map((group) => group.id));

fifa2026ChecklistRows.forEach((row) => {
  const team = resolveTeamForRow(row);
  const groupName = team ? team.name : specialGroupNameForRow(row);
  const id = team ? teamGroupId(team) : groupIdForName(groupName);

  if (!existingGroupIds.has(id)) {
    existingGroupIds.add(id);
    groups.push({
      id,
      name: groupName,
      icon: team?.icon ?? specialGroupIcons[groupName],
      section: team ? 'team' : 'special',
      teamCode: team?.code,
      teamName: team?.name,
      groupLetter: team?.groupLetter,
      color: palette[groups.length % palette.length],
      sortOrder: groups.length,
      verified: false,
      note: 'Additional checklist group discovered in the community checklist source.',
    });
  }
});

const positionByGroup = new Map<string, number>();

const slots: StickerSlot[] = fifa2026ChecklistRows.map((row) => {
  const team = resolveTeamForRow(row);
  const groupName = team ? team.name : specialGroupNameForRow(row);
  const groupId = team ? teamGroupId(team) : groupIdForName(groupName);
  const currentIndex = positionByGroup.get(groupId) ?? 0;
  const slotType = slotTypeForRow(row);

  positionByGroup.set(groupId, currentIndex + 1);

  return {
    id: row.id,
    groupId,
    label: row.title,
    type: slotType,
    page: Math.floor(currentIndex / 9) + 1,
    position: currentIndex + 1,
    verified: false,
    teamCode: team?.code,
    teamName: team?.name,
    country: team?.name,
    groupName: team ? `Group ${team.groupLetter}` : groupName,
    playerName: slotType === 'player' ? row.title : undefined,
    note:
      'Checklist row imported from the LastSticker Panini FIFA World Cup 2026 checklist. This is actual row data, but it remains community-sourced rather than officially published by Panini or FIFA.',
    searchableText: searchable([
      row.id,
      row.title,
      row.section,
      row.type,
      team?.name,
      team?.groupLetter ? `Group ${team.groupLetter}` : undefined,
    ]),
  };
});

// TODO: The app now uses actual slot IDs, labels, and insert variants extracted from the
// LastSticker community checklist page with 1,195 visible rows. This removes the generated
// placeholder IDs, but the checklist is still community-sourced rather than an official Panini export.
// If an official Panini checklist becomes publicly available, replace this source file while keeping
// the same app model and rendering logic.
export const fifaWorldCup2026Template: AlbumTemplate = {
  id: 'fifa-world-cup-2026',
  name: 'FIFA World Cup 2026',
  year: 2026,
  publisher: 'Panini',
  groups,
  slots,
  sourceSummary: {
    verified: [
      'FIFA officially published the 2026 tournament groups used for team ordering.',
      'FIFA officially published the World Cup host context referenced by the template metadata.',
      'The community checklist extracted here exposes 1,195 sticker rows with real sticker IDs and names.',
    ],
    placeholder: [
      'The checklist row data is no longer generated placeholder data, but it is still community-sourced from LastSticker rather than an official Panini export.',
      'App page numbers are simulated from checklist order within each section, not from confirmed physical album spreads.',
      'Player positions are still unavailable in this source and remain unset.',
    ],
    officialSources: [
      'https://www.fifa.com/en/articles/fifa-panini-collection-app',
      'https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/match-schedule-fixtures-results-teams-stadiums',
      'https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/world-cup-2026-stadiums-fifa-soccer-football-mexico-usa-canada',
    ],
    communitySources: [
      'https://www.laststicker.com/cards/panini_world_cup_2026/checklist',
      'Checklist accessed through the rendered browser page during this session.',
    ],
  },
};

export const albumTemplates: AlbumTemplate[] = [fifaWorldCup2026Template];
