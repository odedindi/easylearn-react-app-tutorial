import type { FC, PropsWithChildren } from 'react';
import SessionProvider from './sessionProvider';

const Providers: FC<PropsWithChildren> = ({ children }) => <SessionProvider>{children}</SessionProvider>;

export default Providers;
