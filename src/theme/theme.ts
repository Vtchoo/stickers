export const theme = {
  colors: {
    background: '#0b1118',
    surface: '#111a24',
    surfaceMuted: '#1a2734',
    surfaceStrong: '#1d3954',
    card: '#0f1822',
    text: '#edf3f8',
    textMuted: '#9ab0c2',
    primary: '#ff7a3c',
    primarySoft: '#4c2a18',
    secondary: '#2f95a0',
    success: '#3fa86a',
    warning: '#d9a43b',
    danger: '#d85b5b',
    border: '#243648',
    white: '#ffffff',
    albumPaper: '#121c27',
    slotEmpty: '#192632',
    slotOwned: '#1f4e39',
    slotDuplicate: '#5a341f',
  },
  spacing: {
    xs: 6,
    sm: 10,
    md: 16,
    lg: 20,
    xl: 28,
  },
  radii: {
    sm: 10,
    md: 16,
    lg: 24,
    pill: 999,
  },
};

export type AppTheme = typeof theme;