'use client';
import { createTheme } from '@mui/material/styles';
import { blue } from '@mui/material/colors';

const theme = createTheme({
  typography: {
    fontFamily: '"Roboto",Arial,Helvetica,sans-serif',
  },
  palette: {
    primary: {
      main: '#1e88e5',
    },
    secondary: blue,
  },
});

export default theme;
