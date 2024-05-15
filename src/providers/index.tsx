import type { FC, PropsWithChildren } from 'react';
import SessionProvider from './sessionProvider';
import StylesProvider from './stylesProvider';

const Providers: FC<PropsWithChildren> = ({ children }) => (
    <SessionProvider>
        <StylesProvider>{children}</StylesProvider>
    </SessionProvider>
);

export default Providers;
