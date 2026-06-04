import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

export const Screen = styled(SafeAreaView).attrs({ edges: ['top'] })`
  flex: 1;
  background-color: ${(props) => props.theme.colors.background};
`;

export const ScrollContent = styled.ScrollView.attrs((props) => ({
  contentContainerStyle: {
    padding: props.theme.spacing.md,
    paddingBottom: props.theme.spacing.xl * 2,
    gap: props.theme.spacing.md,
  },
  showsVerticalScrollIndicator: false,
}))``;

export const Hero = styled(LinearGradient).attrs((props) => ({
  colors: [props.theme.colors.surfaceStrong, '#2b5271'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
}))`
  border-radius: ${(props) => props.theme.radii.lg}px;
  padding: ${(props) => props.theme.spacing.lg}px;
  margin-bottom: ${(props) => props.theme.spacing.md}px;
`;

export const Card = styled.View`
  background-color: ${(props) => props.theme.colors.card};
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.radii.lg}px;
  padding: ${(props) => props.theme.spacing.md}px;
  margin-bottom: ${(props) => props.theme.spacing.md}px;
  gap: ${(props) => props.theme.spacing.sm}px;
`;

export const Row = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const RowBetween = styled(Row)`
  justify-content: space-between;
`;

export const Column = styled.View`
  flex: 1;
`;

export const Title = styled.Text`
  color: ${(props) => props.theme.colors.text};
  font-size: 28px;
  font-weight: 800;
`;

export const Heading = styled.Text`
  color: ${(props) => props.theme.colors.text};
  font-size: 20px;
  font-weight: 800;
`;

export const Subtitle = styled.Text`
  color: ${(props) => props.theme.colors.textMuted};
  font-size: 14px;
  line-height: 20px;
`;

export const HeroTitle = styled(Title)`
  color: ${(props) => props.theme.colors.white};
`;

export const HeroText = styled(Subtitle)`
  color: rgba(255, 255, 255, 0.84);
`;

export const Label = styled.Text`
  color: ${(props) => props.theme.colors.text};
  font-size: 15px;
  font-weight: 700;
`;

export const SmallText = styled.Text`
  color: ${(props) => props.theme.colors.textMuted};
  font-size: 12px;
  line-height: 18px;
`;

export const Input = styled.TextInput`
  background-color: ${(props) => props.theme.colors.surface};
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.radii.md}px;
  color: ${(props) => props.theme.colors.text};
  padding: ${(props) => props.theme.spacing.md}px;
  font-size: 15px;
  margin-top: ${(props) => props.theme.spacing.sm}px;
`;

export const Button = styled.Pressable<{ $variant?: 'primary' | 'secondary' | 'danger'; $block?: boolean }>`
  background-color: ${(props) =>
    props.$variant === 'secondary'
      ? props.theme.colors.surfaceStrong
      : props.$variant === 'danger'
        ? props.theme.colors.danger
        : props.theme.colors.primary};
  border-radius: ${(props) => props.theme.radii.md}px;
  padding: ${(props) => props.theme.spacing.md}px;
  align-items: center;
  justify-content: center;
  ${(props) => (props.$block ? 'width: 100%;' : '')}
`;

export const ButtonText = styled.Text`
  color: ${(props) => props.theme.colors.white};
  font-size: 15px;
  font-weight: 800;
`;

export const GhostButton = styled.Pressable`
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.border};
  background-color: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.radii.md}px;
  padding: ${(props) => props.theme.spacing.md}px;
  align-items: center;
  justify-content: center;
`;

export const GhostButtonText = styled.Text`
  color: ${(props) => props.theme.colors.text};
  font-size: 14px;
  font-weight: 700;
`;

export const Badge = styled.View<{ $tone?: 'default' | 'success' | 'warning' | 'danger' }>`
  background-color: ${(props) =>
    props.$tone === 'success'
      ? props.theme.colors.slotOwned
      : props.$tone === 'warning'
        ? props.theme.colors.slotDuplicate
        : props.$tone === 'danger'
          ? '#f5c2c2'
          : props.theme.colors.surfaceMuted};
  padding-left: ${(props) => props.theme.spacing.sm}px;
  padding-right: ${(props) => props.theme.spacing.sm}px;
  padding-top: 4px;
  padding-bottom: 4px;
  border-radius: ${(props) => props.theme.radii.pill}px;
`;

export const BadgeText = styled.Text`
  color: ${(props) => props.theme.colors.text};
  font-size: 12px;
  font-weight: 700;
`;

export const ChipRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: ${(props) => props.theme.spacing.sm}px;
  margin-bottom: ${(props) => props.theme.spacing.sm}px;
`;

export const Chip = styled.Pressable<{ $selected?: boolean }>`
  background-color: ${(props) =>
    props.$selected ? props.theme.colors.primary : props.theme.colors.surface};
  border-width: 1px;
  border-color: ${(props) =>
    props.$selected ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: ${(props) => props.theme.radii.pill}px;
  padding-left: ${(props) => props.theme.spacing.md}px;
  padding-right: ${(props) => props.theme.spacing.md}px;
  padding-top: 9px;
  padding-bottom: 9px;
  margin-right: ${(props) => props.theme.spacing.sm}px;
  margin-bottom: ${(props) => props.theme.spacing.sm}px;
`;

export const ChipText = styled.Text<{ $selected?: boolean }>`
  color: ${(props) => (props.$selected ? props.theme.colors.white : props.theme.colors.text)};
  font-size: 13px;
  font-weight: 700;
`;

export const StatGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: ${(props) => props.theme.spacing.sm}px;
`;

export const StatCard = styled.View`
  width: 48%;
  background-color: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.radii.md}px;
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.border};
  padding: ${(props) => props.theme.spacing.md}px;
  margin-right: 2%;
  margin-bottom: ${(props) => props.theme.spacing.sm}px;
`;

export const StatValue = styled.Text`
  color: ${(props) => props.theme.colors.text};
  font-size: 24px;
  font-weight: 800;
`;

export const ProgressRail = styled.View`
  width: 100%;
  height: 10px;
  border-radius: ${(props) => props.theme.radii.pill}px;
  background-color: ${(props) => props.theme.colors.surfaceMuted};
  overflow: hidden;
  margin-top: ${(props) => props.theme.spacing.sm}px;
`;

export const ProgressFill = styled.View<{ $width: number }>`
  height: 100%;
  width: ${(props) => `${props.$width}%`};
  background-color: ${(props) => props.theme.colors.primary};
`;

export const Divider = styled.View`
  height: 1px;
  background-color: ${(props) => props.theme.colors.border};
  margin-top: ${(props) => props.theme.spacing.sm}px;
  margin-bottom: ${(props) => props.theme.spacing.sm}px;
`;

export const EmptyState = styled(Card)`
  align-items: center;
`;

export const SlotActionRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const MiniAction = styled.Pressable<{ $tone?: 'add' | 'remove' | 'missing' }>`
  min-width: 36px;
  align-items: center;
  justify-content: center;
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: ${(props) => props.theme.radii.md}px;
  background-color: ${(props) =>
    props.$tone === 'remove'
      ? props.theme.colors.surfaceStrong
      : props.$tone === 'missing'
        ? props.theme.colors.surfaceMuted
        : props.theme.colors.primary};
  margin-left: ${(props) => props.theme.spacing.xs}px;
`;

export const MiniActionText = styled.Text<{ $tone?: 'add' | 'remove' | 'missing' }>`
  color: ${(props) =>
    props.$tone === 'missing' ? props.theme.colors.text : props.theme.colors.white};
  font-size: 13px;
  font-weight: 800;
`;