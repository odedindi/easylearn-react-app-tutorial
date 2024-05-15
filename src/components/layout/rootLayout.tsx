import type { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { Footer } from './footer';

export const RootLayout: FC = () => (
    <>
        <h1>Root Layout</h1>
        <Outlet />
        <Footer />
    </>
);
