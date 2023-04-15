import { createContext, useMemo, useState } from 'react';
import { createTheme } from '@mui/material/styles';

type DarkModeProps = 'dark' | 'light';

// color design doken
const colors = {
  white: '#fcfcfc',
  grey: {
    100: '#e0e0e0',
    200: '#c2c2c2',
    300: '#a3a3a3',
    400: '#858585',
    500: '#666666',
    600: '#525252',
    700: '#3d3d3d',
    800: '#292929',
    900: '#141414'
  },
  orange: {
    100: '#fff3e0',
    200: '#ffe0b2',
    300: '#ffcc80',
    400: '#ffb74d',
    500: '#ffa726',
    600: '#fb8c00',
    700: '#f57c00',
    800: '#ef6c00',
    900: '#e65100'
  },
  navyBlue: {
    100: '#cbd4e6',
    200: '#a9b8d5',
    300: '#879bc5',
    400: '#647fb4',
    500: '#4b659b',
    600: '#3a4f78',
    700: '#2a3856',
    800: '#192234',
    900: '#080b11'
  },
  teal: {
    100: '#e0f2f1',
    200: '#b2dfdb',
    300: '#80cbc4',
    400: '#4db6ac',
    500: '#26a69a',
    600: '#009688',
    700: '#00897b',
    800: '#00796b',
    900: '#00695c'
  }
};

export const themeSettings = (mode: DarkModeProps) => {
  return {
    palette: {
      mode: mode,
      ...(mode === 'dark'
        ? {
            // palette values for dark mode
            primary: {
              main: colors.teal[500]
            },
            secondary: {
              main: colors.orange[900]
            },
            background: {
              default: colors.navyBlue[800],
              paper: colors.navyBlue[700]
            },
            text: {
              primary: colors.white,
              secondary: colors.grey[700]
            }
          }
        : {
            // palette values for light mode
            primary: {
              main: colors.orange[900]
            },
            secondary: {
              main: colors.teal[500]
            },
            background: {
              default: colors.white,
              paper: colors.grey[100]
            },
            text: {
              primary: colors.grey[700],
              secondary: colors.grey[700]
            }
          })
    },
    typography: {
      fontFamily: 'Source Sans Pro, sans-serif',
      h1: {
        fontWeight: 700,
        fontSize: 40,
        lineHeight: 1.2
      },
      h2: {
        fontWeight: 700,
        fontSize: 32,
        lineHeight: 1.2
      },
      h3: {
        fontWeight: 700,
        fontSize: 24,
        lineHeight: 1.2
        // letterSpacing: '0em'
      },
      h4: {
        fontWeight: 700,
        fontSize: 20,
        lineHeight: 1.2
      },
      h5: {
        fontWeight: 700,
        fontSize: 16,
        lineHeight: 1.2
      },
      h6: {
        fontWeight: 700,
        fontSize: 14,
        lineHeight: 1.2
      }
    }
  };
};

export const ColorModeContext = createContext({
  toggleColorMode: () => {}
});

export const useMode = () => {
  const [mode, setMode] = useState<DarkModeProps>('dark');

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'dark' ? 'light' : 'dark'));
      }
    }),
    []
  );

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return { theme, colorMode };
};
