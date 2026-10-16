import { useColorModeValue } from '@chakra-ui/react';

export const colors = {
  brand: {
    100: '#CFFAFE',
    200: '#A5F3FC',
    300: '#67E8F9',
    400: '#22D3EE',
    500: '#06B6D4',
    600: '#0891B2',
    700: '#0E7490',
    800: '#155E75',
    900: '#164E63',
  },
  brandScheme: {
    100: '#CFFAFE',
    200: '#A5F3FC',
    300: '#67E8F9',
    400: '#22D3EE',
    500: '#06B6D4',
    600: '#0891B2',
    700: '#0E7490',
    800: '#155E75',
    900: '#164E63',
  },
  brandTabs: {
    100: '#CFFAFE',
    200: '#A5F3FC',
    300: '#67E8F9',
    400: '#22D3EE',
    500: '#06B6D4',
    600: '#0891B2',
    700: '#0E7490',
    800: '#155E75',
    900: '#164E63',
  },
  secondaryGray: {
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },
  red: {
    100: '#FEE2E2',
    500: '#EF4444',
    600: '#DC2626',
  },
  blue: {
    50: '#EFF6FF',
    500: '#3B82F6',
  },
  orange: {
    100: '#FFEDD5',
    500: '#F97316',
  },
  green: {
    100: '#DCFCE7',
    500: '#22C55E',
  },
  navy: {
    50: '#E2E8F0',
    100: '#CBD5E1',
    200: '#94A3B8',
    300: '#64748B',
    400: '#475569',
    500: '#334155',
    600: '#1E293B',
    700: '#172033',
    800: '#111827',
    900: '#0B0D12',
  },
  gray: {
    100: '#F8FAFC',
  },
};

export const light = {
  globalBg: '#F5F7FB',
  brand: 'brand.600',
  textColorPrimary: 'secondaryGray.900',
  textColorSecondary: 'secondaryGray.500',
  textColorDetails: 'secondaryGray.700',
  borderColor: '#E2E8F0 !important',
  cardBg: '#FFFFFF',
  menuBg: '#FFFFFF',
  shadow: '0 8px 30px rgba(15, 23, 42, 0.06)',
};

export const dark = {
  globalBg: 'navy.900',
  brand: 'brand.400',
  textColorPrimary: '#F8FAFC',
  textColorSecondary: '#94A3B8',
  textColorDetails: '#CBD5E1',
  borderColor: 'rgba(148, 163, 184, 0.14) !important',
  cardBg: 'navy.800',
  menuBg: 'navy.800',
  shadow: '0 12px 36px rgba(0, 0, 0, 0.18)',
};

export function useColors() {
  return useColorModeValue(light, dark);
}

export function useColorsExtend<T>(_light: T, _dark: T) {
  return useColorModeValue({ ...light, ..._light }, { ...dark, ..._dark });
}

export function useItemHoverBg() {
  return useColorModeValue(
    { cursor: 'pointer', bg: 'white', boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)' },
    { cursor: 'pointer', bg: 'navy.700', boxShadow: 'unset' }
  );
}
