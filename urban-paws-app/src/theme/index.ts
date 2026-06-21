export const colors = {
  paw: '#E8531A',
  pawDeep: '#B8400F',
  pawSoft: '#FDF0EB',
  pawAmber: '#F5A623',
  night: '#0F0D0B',
  bark: '#2C1F14',
  sage: '#2D5A3D',
  cream: '#FDFAF7',
  warmGray: '#8A7F75',
  border: 'rgba(0,0,0,0.08)',
  cardBg: '#FFFFFF',
  text: '#1A1410',
  muted: '#6B5E54',
  white: '#FFFFFF',
  success: '#2E7D32',
  successBg: '#E8F5E9',
  danger: '#BF360C',
  dangerBg: '#FBE9E7',
  overlay: 'rgba(0,0,0,0.55)',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  pill: 999,
} as const;

export const typography = {
  display: {
    fontWeight: '800' as const,
    letterSpacing: -0.5,
  },
  heading: {
    fontWeight: '700' as const,
  },
  body: {
    fontWeight: '400' as const,
  },
  label: {
    fontWeight: '600' as const,
    letterSpacing: 0.4,
  },
};

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  floating: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 6,
  },
};
