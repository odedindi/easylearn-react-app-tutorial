import { Suspense, type FC } from 'react';
import './App.css';
import { type RouteObject, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { IndexPage } from './pages/indexPage';
import { RegisterPage } from './pages/auth/registerPage';
import { MySettingsPage } from './pages/user-management/mySettingsPage';
import { NotFoundPage } from './pages/notFoundPage';
import { RootLayout } from '@components/layout';
import Providers from './providers';

export const routes: RouteObject[] = [
    {
        path: '/',
        element: (
            <Providers>
                <RootLayout />
            </Providers>
        ),
        loader: async () => {
            return null;
        },
        errorElement: <NotFoundPage />,
        children: [
            {
                index: true,
                element: <IndexPage />,
            },
            {
                path: '/auth/register',
                element: <RegisterPage />,
            },
            {
                path: '/user-management/my-settings',
                element: <MySettingsPage />,
            },
            {
                path: '*',
                element: <NotFoundPage />,
            },
        ],
    },
];

const router = createBrowserRouter(routes);

const App: FC = () => (
    <Suspense fallback="loading...">
        <RouterProvider router={router} />
    </Suspense>
);

export default App;
