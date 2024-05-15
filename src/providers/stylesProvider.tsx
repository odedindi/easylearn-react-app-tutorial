import type { FC, PropsWithChildren } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@config/theme';

const StylesProvider: FC<PropsWithChildren> = ({ children }) => (
    <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
    </ThemeProvider>
);

export default StylesProvider;
