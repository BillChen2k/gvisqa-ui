import {createTheme, SnackbarOrigin} from '@mui/material';
import {blueGrey, cyan, grey} from '@mui/material/colors';

const config = {
  // MuiThemeProvider options
  theme: createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: grey[900],
        light: grey[600],
        dark: grey[900],
      },
      secondary: blueGrey,
    },
    typography: {
      fontFamily: 'Roboto, Helvetica, -apple-system, Segoe UI, Helvetica Neue, Arial',
      fontSize: 12,
    },
  }),
  darkTheme: createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: grey[100],
        light: grey[600],
        dark: grey[100],
      },
      secondary: blueGrey,
    },
    typography: {
      fontFamily: 'Roboto, Helvetica, -apple-system, Segoe UI, Helvetica Neue, Arial',
      fontSize: 12,
    },
  }),
  appearance: {
    sideBarWidth: '24rem',
    appBarHeight: '48px',
    snackBarAutoHideDuration: 5000, // in ms
    snackBarAnchorOrigin: {
      vertical: 'bottom',
      horizontal: 'right',
    } as SnackbarOrigin,
    g6CoreHeight: 630,
  },
  API: '/api',
  map: {
    apiToken: 'pk.eyJ1IjoiYmlsbGNoZW4yayIsImEiOiJja3R2MDBwNWgyNDljMnBvMmdzbnU0dTZ5In0.To49SgD0gHYceQ8Ap2BG3g',
  },
};

export default config;

