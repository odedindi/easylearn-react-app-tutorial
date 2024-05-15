import type { FC, PropsWithChildren } from 'react';
import { SnackbarProvider } from 'notistack';
import Toaster from '@components/ui/toaster';

const ToastProvider: FC<PropsWithChildren> = ({ children }) => (
    <SnackbarProvider maxSnack={8} Components={{ toaster: Toaster }}>
        {children}
    </SnackbarProvider>
);

export default ToastProvider;
