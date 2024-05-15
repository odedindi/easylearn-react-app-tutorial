import type { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { Footer } from './footer';
import Container from '@mui/material/Container';

export const RootLayout: FC = () => (
    <>
        <Container>
            <Outlet />
            <Footer />
        </Container>
    </>
);
