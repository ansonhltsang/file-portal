import { MantineProvider, MantineThemeOverride } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

export const theme: MantineThemeOverride = {
  colorScheme: 'light',
  fontFamily: 'sans-serif',
  headings: {
    fontWeight: 400,
    fontFamily: 'sans-serif',
  },
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
      <Notifications limit={5} />
      {children}
    </MantineProvider>
  );
}
