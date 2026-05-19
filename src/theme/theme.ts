export const theme = {
  colors: {
    background: '#f7f0df',
    surface: '#fffaf0',
    surfaceMuted: '#efe4cc',
    surfaceStrong: '#14304a',
    card: '#fffdf8',
    text: '#1e2b36',
    textMuted: '#65717a',
    primary: '#eb6a2a',
    primarySoft: '#ffd2b4',
    secondary: '#0f6d74',
    success: '#2f8f53',
    warning: '#c48a1e',
    danger: '#bf4040',
    border: '#d9c9af',
    white: '#ffffff',
    albumPaper: '#f8f2e2',
    slotEmpty: '#efe4cc',
    slotOwned: '#9ed7a5',
    slotDuplicate: '#f7b27d',
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