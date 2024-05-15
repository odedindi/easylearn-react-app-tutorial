import type { FC, PropsWithChildren } from 'react';
import SessionProvider from './sessionProvider';
import StylesProvider from './stylesProvider';
import ToastProvider from './toasterProvider';
import ApiV1Provider from './apiV1Provider';

const Providers: FC<PropsWithChildren> = ({ children }) => (
    <SessionProvider>
        <ToastProvider>
            <ApiV1Provider>
                <StylesProvider>{children}</StylesProvider>
            </ApiV1Provider>
        </ToastProvider>
    </SessionProvider>
);

export default Providers;
