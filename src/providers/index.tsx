import type { FC, PropsWithChildren } from 'react';
import SessionProvider from './sessionProvider';
import StylesProvider from './stylesProvider';
import ToastProvider from './toasterProvider';

const Providers: FC<PropsWithChildren> = ({ children }) => (
    <SessionProvider>
        <ToastProvider>
            <StylesProvider>{children}</StylesProvider>
        </ToastProvider>
    </SessionProvider>
);

export default Providers;
