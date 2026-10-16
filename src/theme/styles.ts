import { mode } from '@chakra-ui/theme-tools';
import { dark, light } from './colors';

export const globalStyles = (props: any) => ({
  '::-webkit-scrollbar': {
    width: '6px',
    height: '6px',
    background: 'transparent',
  },
  '::-webkit-scrollbar-thumb': {
    borderRadius: '999px',
    background: mode('rgba(15, 23, 42, 0.2)', 'rgba(148, 163, 184, 0.24)')(props),
  },
  '::-webkit-calendar-picker-indicator': {
    filter: mode('none', 'invert(1)')(props),
  },
  '::selection': {
    background: 'rgba(34, 211, 238, 0.28)',
  },
  'html, body, #root': {
    minHeight: '100%',
  },
  body: {
    color: mode(light.textColorPrimary, dark.textColorPrimary)(props),
    overflow: 'hidden',
    background: mode(light.globalBg, dark.globalBg)(props),
    fontFamily: 'Inter, DM Sans, sans-serif',
    letterSpacing: '-0.01em',
    WebkitFontSmoothing: 'antialiased',
  },
  'button, input, textarea, select': {
    font: 'inherit',
  },
  input: {
    color: mode('secondaryGray.900', 'gray.100')(props),
  },
  'a:focus-visible, button:focus-visible, input:focus-visible, textarea:focus-visible': {
    outline: '2px solid #22D3EE',
    outlineOffset: '2px',
  },
  '.chakra-card': {
    borderRadius: '18px',
    boxShadow: 'none',
    transition: 'border-color 160ms ease, transform 160ms ease',
  },
  '.chakra-card:hover': {
    borderColor: mode('rgba(6, 182, 212, 0.35)', 'rgba(34, 211, 238, 0.22)')(props),
  },
});
