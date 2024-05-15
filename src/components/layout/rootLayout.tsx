import type { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { Footer } from './footer';
import Container from '@mui/material/Container';
import { Nav } from './nav';

export const RootLayout: FC = () => (
    <>
        <Nav />
        <Container>
            <Outlet />
            <Footer />
        </Container>
    </>
);
