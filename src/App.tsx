import { Suspense, type FC, PropsWithChildren } from 'react';
import './App.css';
import { Navigate, Outlet, RouteObject, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { IndexPage } from './pages/indexPage';
import { RegisterPage } from './pages/auth/registerPage';
import { MySettingsPage } from './pages/user-management/mySettingsPage';
import { NotFoundPage } from './pages/notFoundPage';
import { RootLayout } from '@components/layout';
import Providers from './providers';
import { useAuth } from './providers/sessionProvider';

const ProtectedRoute: FC<PropsWithChildren<{ redirectPath?: string }>> = ({ children, redirectPath = '/' }) => {
    const { session } = useAuth();

    if (!session.isLoggedIn) return <Navigate to={redirectPath} />;
    return children ? children : <Outlet />;
};

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
                element: (
                    <ProtectedRoute redirectPath="/404">
                        <MySettingsPage />
                    </ProtectedRoute>
                ),
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
