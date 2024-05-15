import { useContext, createContext, useState, PropsWithChildren, FC } from 'react';
import { useNavigate } from 'react-router-dom';

type AuthUserType = 'anonymous' | 'authenticated';
type GenericUser<T extends AuthUserType, Payload extends object = {}> = {
    type: T;
} & Payload;
type UserData = { id: string; username: string };
export type AnonymousAuthUser = GenericUser<'anonymous'>;
export type AuthenticatedAuthUser = GenericUser<'authenticated', { apiKey: string; user: UserData }>;
export type AuthUser = AnonymousAuthUser | AuthenticatedAuthUser;

export type Session =
    | { isLoggedIn: false; data: AnonymousAuthUser }
    | { isLoggedIn: true; data: AuthenticatedAuthUser };

export const anonymousAuthUser: AnonymousAuthUser = { type: 'anonymous' };

export const mockedAuthenticatedUser: AuthenticatedAuthUser = {
    type: 'authenticated',
    apiKey: 'foo',
    user: {
        id: 'foo',
        username: 'Linus',
    },
};
/**
 * This represents some generic auth provider API, like Auth.js.
 */

interface SessionContext {
    session: Session;
    signin(_user: AuthUser, _options?: { redirect?: string }): Promise<void>;
    signout(_options?: { redirect?: string }): Promise<void>;
}
const sessionContext = createContext<SessionContext>(null!!);

const { Provider } = sessionContext;
const SessionProvider: FC<PropsWithChildren> = ({ children }) => {
    const [session, setSession] = useState<Session>({ isLoggedIn: false, data: anonymousAuthUser });

    const navigate = useNavigate();

    return (
        <Provider
            value={{
                session,
                signin: async (user, options) => {
                    if (user.type === 'authenticated') {
                        await new Promise((r) => setTimeout(r, 500)); // fake delay
                        setSession({ isLoggedIn: true, data: user });
                        if (options?.redirect) navigate(options.redirect);
                    }
                },
                signout: async (options) => {
                    await new Promise((r) => setTimeout(r, 500)); // fake delay
                    setSession({ isLoggedIn: false, data: anonymousAuthUser });
                    if (options?.redirect) navigate(options.redirect);
                },
            }}>
            {children}
        </Provider>
    );
};

export default SessionProvider;

export const useAuth = () => useContext(sessionContext);
