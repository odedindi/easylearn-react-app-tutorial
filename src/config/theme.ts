import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

const theme = createTheme({
    palette: {
        primary: {
            main: '#19857b',
        },
        secondary: {
            main: '#556cd6',
        },
        error: {
            main: red.A400,
        },
    },
});

export default theme;
