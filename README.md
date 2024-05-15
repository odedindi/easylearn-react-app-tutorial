# react-app-tutorial

The purpose of this app is juice up Marcel's app just a bit, with a bit different folder structure and code splitting principles, utilizing third party services (avoiding setting up a toaster service from scratch for example) as well as other react best practices

## 1. setup

_i rather use yarn or pnpm_ read more [here](https://www.knowledgehut.com/blog/web-development/yarn-vs-npm) and [here](https://hackernoon.com/choosing-the-right-package-manager-npm-yarn-or-pnpm) let's use yarn [berry](https://github.com/yarnpkg/berry) cause it has a great tools that come out of the box like out install required types libraries as well as an easy to use dependency upgrade tool.

-   if you do not have yarn install better install it globally by running: `npm install -g yarn`
-   create a folder and access it using your terminal
-   run: `yarn create react-app . --template typescript`
    _when using yarn i like better using the berry version_
-   run: `yarn set version berry`
-   add `nodeLinker: node-modules` in you new .yarnrc.yml file so the file looks like this:

```
nodeLinker: node-modules
yarnPath: .yarn/releases/yarn-4.2.2.cjs
```

-   run: `yarn` to install all the dependencies using our new packageManager
-   the file `.yarn/install-state.gz` is for local usage and so we do could and should add it to our .gitignore file

_as I know that in step 2.7 we intend on ejecting and customizing the webpack config file to ramp up our import paths, it is better to already do it now_

\*as we have untracked files we can not yet eject, let's commit our work so far`

-   run: `git add . && git commit -m "init"`
-   run: `yarn eject` and do what is required of you.

#### using the CRA command gives us a nice start but the dependencies are bound to be outdated

let's update all required dependencies to their latest versions

-   run `yarn upgrade-interactive`
    **for all the options except for _eslint_ please do not install v9, i used here the version 8.57, and _webpack-dev-server_ please dont install v5, i used here 4.15.2, as there are significant breaking changes and it is too much to deal with for this tutorial for all other dependencies there shouldn't be any problem using their latest version from what i saw**

-   setup linting and prettier, run: `yarn add -D prettier eslint-plugin-prettier eslint-config-prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser`
-   create at the root a `.prettierrc` file and add the properties shown in[ marcel's tutorial](https://github.com/inkognitro/react-app-tutorial/blob/main/01-setup.md#//%20.prettierrc.js:~:text=prettierrc.js%20file%3A-,//%20.prettierrc.js,-module.exports) take the brakets and the content in the brakets but omit the `module.export =` part.

-   create at the root a `.prettierignore` file and add the following:

```
.yarn
node_modules
*.lock
```

-   add the following eslint rules in package.json:
    while we are editing the `webpack.config.js` file let's add one additional eslint rule that i like `no-unused-vars`:

```
     "eslintConfig": {
        "extends": [
            "react-app",
            "react-app/jest",
            "plugin:@typescript-eslint/eslint-recommended",
            "plugin:prettier/recommended"
        ],
        "plugins": [
            "prettier"
        ],
        "parser": "@typescript-eslint/parser",
        "rules": {
            "prettier/prettier": "error",
            "@typescript-eslint/no-redeclare": "error",
            "no-unused-vars": [
                "warn",
                {
                    "argsIgnorePattern": "^_",
                    "varsIgnorePattern": "^_",
                    "caughtErrorsIgnorePattern": "^_"
                }
            ]
        }
    },
```

-   add the following scripts in package.json:

```
    "lint": "eslint ./src --ext .ts,.tsx",
    "lint:fix": "tsc && eslint ./src --ext .ts,.tsx --quiet --fix",
    "format": "prettier --write ."
```

-   run `yarn lint` to see we got a bunch of errors.
-   run `yarn lint:fix` we will have an error in the `reportWebVitals.ts` file, it is a result of CRA beeing so unupdated, you can read more about `web-vitals` [here](https://www.npmjs.com/package/web-vitals), you can fix it by updating the `reportWebVitals` function with the following code:

```
import { MetricType, ReportOpts } from 'web-vitals';

const reportWebVitals = (onPerfEntry?: (metric: MetricType) => void, opts?: ReportOpts) => {
    if (onPerfEntry && onPerfEntry instanceof Function) {
        import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
            onCLS(onPerfEntry, opts);
            onINP(onPerfEntry, opts);
            onFCP(onPerfEntry, opts);
            onLCP(onPerfEntry, opts);
            onTTFB(onPerfEntry, opts);
        });
    }
};

export default reportWebVitals;
```

we actually dont need it in this tutorial, so let's just delete the file and remove the usage of the `reportWebVitals` function from the bottom of the `index.tsx` file.

### Ramping out import paths

let's already add all the required import path for our tutorial
_package.json_

-   add under `jest`, `moduleNameMapper`

```
    "@packages/(.*)": "<rootDir>/src/packages/$1",
    "@components(.*)$": "<rootDir>/src/components/$1",
    "@config(.*)$": "<rootDir>/src/config/$1",
    "@hooks(.*)$": "<rootDir>/src/hooks/$1",
    "@utils(.*)$": "<rootDir>/src/utils/$1"

```

_tsconfig.json_

```
    "baseUrl": ".",
    "paths": {
        "@packages/*": ["src/packages/*"],
        "@components/*": ["src/components/*"],
        "@config/*": ["src/config/*"],
        "@hooks/*": ["src/hooks/*"],
        "@utils/*": ["src/utils/*"]
    }
```

_webpack.config.js_

```
    alias: {
        '@packages': path.resolve(__dirname, '../src/packages'),
        '@components': path.resolve(__dirname, '../src/components'),
        '@config': path.resolve(__dirname, '../src/config'),
        '@hooks': path.resolve(__dirname, '../src/hooks'),
        '@utils': path.resolve(__dirname, '../src/utils'),
        // other stuff ...
    }
```

## 2. Routing

we chose to go with `react-router-dom` which is great, there is also [`TanStack Router`](https://tanstack.com/router/latest) which is great and has some really powerful methods under its hood, for our app `react-router-dom` is great, but i think it is better you use its latest syntax of a `RouteObject` array with a `createBrowserRouter` or `createMemoryBrowser` motheds.

-   install react-router-dom by running: `yarn add react-router-dom`
    lets create the base provider wrapper, the root layout and couple of pages.

-   create `src/providers/index.tsx`:

```
import type { FC, PropsWithChildren } from 'react';

const Providers: FC<PropsWithChildren> = ({ children }) => <>{children}</>;

export default Providers;
```

-   create `src/components/layout/rootLayout.tsx`

```
import type { FC } from 'react';
import { Outlet } from 'react-router-dom';

export const RootLayout: FC = () => (
    <>
        <h1>Root Layout</h1>
        <Outlet />
    </>
);
```

-   create `src/pages/indexPage.tsx`:

```
import type { FC } from 'react';

export const IndexPage: FC = () => {
    return <>Index Page</>;
};

```

-   create `src/pages/notFoundPage.tsx`:

```
import type { FC } from 'react';

export const NotFoundPage: FC = () => {
    return <>Not Found Page</>;
};
```

-   create `src/pages/user-management/mySettingsPage.tsx`:

```
import type { FC } from 'react';

export const MySettingsPage: FC = () => {
    return <>My settings Page</>;
};
```

-   create `src/pages/auth/registerPage.tsx`:

```
import type { FC } from 'react';

export const RegisterPage: FC = () => {
    return <>Register Page</>;
};
```

let update our `App.tsx` file:

```
import { Suspense, type FC } from 'react';
import './App.css';
import { type RouteObject, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { IndexPage } from './pages/indexPage';
import { RegisterPage } from './pages/auth/registerPage';
import { MySettingsPage } from './pages/user-management/mySettingsPage';
import { NotFoundPage } from './pages/notFoundPage';
import { RootLayout } from '@components/layout';

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
```

## 3. Authentication

While the authentication implementation is quite comprehensive, I find it a bit overwhelming and was wondering if we could discuss simplifying it. I believe a more streamlined approach could enhance usability without compromising security.

let's create a `SessionProvider` and `useAuth` hook:

```
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
```

-   update our `Providers` component:

```
import type { FC, PropsWithChildren } from 'react';
import SessionProvider from './sessionProvider';

const Providers: FC<PropsWithChildren> = ({ children }) => <SessionProvider>{children}</SessionProvider>;

export default Providers;
```

4. Global config
   the app config can more easily shared via singleton rather then using context.

-   create `src/config/index.ts`

```
export type Config = {
    companyName: string;
};

export const config: Config = {
    companyName: 'ACME',
};
```

5. useTitle hook

-   create `src/hooks/useTitle.ts`

```
import { config } from '@config/index';
import { useEffect } from 'react';

export const useTitle = (title?: string): void => {
    useEffect(() => {
        if (!document) return;
        const prevTitle = document.title;
        document.title = [title ?? '', config.companyName].filter((str) => str?.length).join(' :: ');

        return () => {
            document.title = prevTitle;
        };
    }, [title]);
};
```

use it in the different pages
for example `pages/indexPage.tsx`

```
import type { FC } from 'react';
import { useTitle } from '@hooks/useTitle';

export const IndexPage: FC = () => {
    useTitle('Home');
    return <>Index Page</>;
};
```

## 6. Styles Provider

as much as I love `Styled-Components` on MUI documentations it is explained why it is better to avoid using it together with mui, so let's prevent headaches and heartbreaks and just not use it

-   run: `yarn add @mui/material @emotion/react @emotion/styled @mui/icons-material`

and let's install the `Roboto` font via the google web fonts cdn, and add the following to our `public/index.html` file

```
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
/>
```

-   create a simple theme at `src/config/theme.ts`:

```
import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

const theme = createTheme({
    palette: {
        primary: {
            main: '#19857b',
        },
        secondary: {
            main: '#556cd6',
        },
        error: {
            main: red.A400,
        },
    },
});

export default theme;
```

-   create `src/providers/stylesProvider.tsx:

```
import type { FC, PropsWithChildren } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@config/theme';

const StylesProvider: FC<PropsWithChildren> = ({ children }) => (
    <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
    </ThemeProvider>
);

export default StylesProvider;
```

-   use the new `StylesProvider`:

```
import type { FC, PropsWithChildren } from 'react';
import SessionProvider from './sessionProvider';
import StylesProvider from './stylesProvider';

const Providers: FC<PropsWithChildren> = ({ children }) => (
    <SessionProvider>
        <StylesProvider>{children}</StylesProvider>
    </SessionProvider>
);

export default Providers;
```

## 7. i18n

you basically wrote an i18n library which is amazing! but also very complicated, let's just use [`react-i18next`](https://react.i18next.com/)

-   run: `yarn add react-i18next i18next i18next-browser-languagedetector i18next-http-backend`

by default `react-18next` will expect the translation files to be in `public/locales/[locale]/translation.json`
it does not really matter but for the sake of the experience let's changes that and add our translation files to `src/config/locales`

-   create `src/config/locales/deCH/translation.json`
-   create `src/config/locales/en/translation.json`
    _i took the liberty and just add all the content of the tutorial already_

let's create our `i18n.ts` file where we set up the i18n service and properties

-   create `src/i18n.ts`:

```
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

import translationDeCH from '@config/locales/deCH/translation.json';
import translationEn from '@config/locales/en/translation.json';

export const ALL_LANGUAGES = ['en', 'deCH'] as const;

export const defaultNS = 'translation';

export const resources = {
    deCH: {
        translation: { ...translationDeCH },
    },
    en: {
        translation: { ...translationEn },
    },
};

i18n
    // i18next-http-backend
    // loads translations from your server
    // https://github.com/i18next/i18next-http-backend
    .use(Backend)
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    .use(LanguageDetector)
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
        debug: process.env.NODE_ENV === 'development',
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },
        lng: ALL_LANGUAGES[0],
        fallbackLng: ALL_LANGUAGES,
        ns: [defaultNS],
        defaultNS,
        resources,
    });

export default i18n;
```

and import it into the `src/index.tsx` file:

```
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// import i18n (needs to be bundled)
import './i18n';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
```

Almost finished!, let's help ourselves by augmenting the `react-i18next` module with our resources so typescript will suggest us translation keys or show errors if we do not use the right translation keys

-   create `src/types/i18next.d.ts` file:

```
import { defaultNS, resources } from '../i18n';

declare module 'i18next' {
    interface CustomTypeOptions {
        resources: (typeof resources)['en'];
        defaultNS: typeof defaultNS;
    }
}
```

done.

let's see that it works, for starters let's create our link components;

-   create `src/components/ui/routing/link.tsx`:

```
import type { FC } from 'react';
import MuiLink, { type LinkProps as MuiLinkProps } from '@mui/material/Link';
import { Link as ReactRouterDomLink } from 'react-router-dom';

export type RoutingLinkProps = Omit<MuiLinkProps, 'component'> & {
    to: string;
};

export const RoutingLink: FC<RoutingLinkProps> = (props) => <MuiLink {...props} component={ReactRouterDomLink} />;

export interface FunctionalLinkProps extends Omit<MuiLinkProps, 'href'> {
    onClick: () => void;
}

export const FunctionalLink: FC<FunctionalLinkProps> = ({ sx, ...props }) => (
    <MuiLink
        {...props}
        sx={[{ cursor: 'pointer' }, ...(Array.isArray(sx) ? sx : [sx])]}
        onClick={(event) => {
            event.preventDefault();
            props.onClick?.();
        }}
    />
);
```

and export these components from `src/components/ui/routing/index.tsx`:

```
export * from './link';'
```

-   create a footer component at `components/layout/footer.tsx`

```
import type { FC } from 'react';
import { FunctionalLink } from '@components/ui/routing';
import { useTranslation } from 'react-i18next';
import { ALL_LANGUAGES } from 'src/i18n';
import { styled } from '@mui/material';

const Base = styled('footer')`
    display: flex;
    justify-content: space-around;
    margin-top: 60px;
`;

const FooterLink = styled(FunctionalLink)<{ selected?: Boolean }>`
    color: ${({ selected }) => (selected ? '#bbb' : '#ddd')};
    text-decoration: none;
    margin: 0 5px;
    font-family: inherit;
    font-size: 12px;
`;

export const Footer: FC = () => {
    const { t, i18n } = useTranslation();

    return (
        <Base>
            <div>
                {ALL_LANGUAGES.map((lng) => (
                    <FooterLink
                        key={lng}
                        selected={i18n.resolvedLanguage === lng}
                        onClick={() => i18n.changeLanguage(lng)}>
                        {t(`core.languages.${lng}`)}
                    </FooterLink>
                ))}
            </div>
        </Base>
    );
};
```

and use it in the rootLayout:

```
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
```

so far as we dont have any content really, you gonna have to trust me it works, but just to be sure let's add a translated title to the index page:

-   add to the german translation file:

```
"pages": {
        "indexPage": {
            "title": "Willkommen",
```

-   add to the english translation file:

```
"pages": {
        "indexPage": {
            "title": "Welcome",
```

and make sure we pass it to the useTitle hook:

```
import type { FC } from 'react';
import { useTitle } from '@hooks/useTitle';
import { useTranslation } from 'react-i18next';

export const IndexPage: FC = () => {
    const { t } = useTranslation();
    useTitle(t('pages.indexPage.title'));
    return <>Index Page</>;
};
```

now if you play with the languages you'll see that the page title changes according to the current selected language.

## 8. Toasters

same here, your implementation is amazing, but i chose to use `notistack` that is actually recomended in MUI documentations for this exactly.

so let's start by installing it

-   run: `yarn add notistack`

now let's augment `notistack` module to our needs

-   create `src/types/notistack.d.ts` file:

```
import type { AlertProps } from '@mui/material';
import { ReactNode } from 'react';

declare module 'notistack' {
    type Severity = NonNullable<AlertProps['severity']>;
    type ExpandableContent = ReactNode | ((_onClose: () => void) => ReactNode);
    interface VariantOverrides {
        toaster: {
            severity?: Severity;
            // content?: ReactNode; // content key is deprecated better use something else
            expandableContent?: ExpandableContent;
        };
    }
}
```

now let's create our custom toaster component:

-   create `src/components/ui/toaster.tsx`

```
import { forwardRef, useCallback, useState } from 'react';
import {
    type CustomContentProps,
    type Severity,
    type ExpandableContent,
    SnackbarContent,
    useSnackbar,
} from 'notistack';
import Collapse from '@mui/material/Collapse';
import MuiTypography from '@mui/material/Typography';
import MuiCard from '@mui/material/Card';
import MuiCardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material';

const Base = styled(SnackbarContent)({
    '@media (min-width:600px)': { minWidth: '344px !important' },
});
const Card = styled(MuiCard)<{ severity: Severity }>(({ theme: { palette }, severity }) => ({
    width: '100%',
    background: palette[severity][palette.mode],
}));
const Typography = styled(MuiTypography)({ color: '#000' });
const CardActions = styled(MuiCardActions)({ padding: '8px 8px 8px 16px', justifyContent: 'space-between' });
const IconsWrapper = styled('div')({ marginLeft: 'auto' });
const ExpandButton = styled(IconButton)<{ expanded?: 0 | 1 }>(({ expanded }) => ({
    padding: '8px 8px',
    color: '#000',
    transition: 'transform 0.2s',
    transform: expanded ? 'rotate(180deg)' : 'init',
}));

interface ToastProps extends CustomContentProps {
    severity: Severity;
    expandableContent?: ExpandableContent;
}

const Toaster = forwardRef<HTMLDivElement, ToastProps>(function Toaster(
    { id, message, severity, expandableContent },
    ref
) {
    const { closeSnackbar } = useSnackbar();
    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = useCallback(() => setExpanded((prevExpanded) => !prevExpanded), []);

    const handleDismiss = useCallback(() => closeSnackbar(id), [id, closeSnackbar]);

    return (
        <>
            <Base ref={ref} role="alert">
                <Card severity={severity ?? 'success'}>
                    <CardActions>
                        <Typography variant="body2">{message}</Typography>
                        <IconsWrapper>
                            {expandableContent ? (
                                <ExpandButton
                                    aria-label="Show more"
                                    size="small"
                                    expanded={expanded ? 1 : 0}
                                    onClick={handleExpandClick}>
                                    <ExpandMoreIcon />
                                </ExpandButton>
                            ) : null}
                            <ExpandButton size="small" onClick={handleDismiss}>
                                <CloseIcon fontSize="small" />
                            </ExpandButton>
                        </IconsWrapper>
                    </CardActions>
                    {expandableContent ? (
                        <Collapse in={expanded} timeout="auto" unmountOnExit>
                            {typeof expandableContent === 'function'
                                ? expandableContent(handleDismiss)
                                : expandableContent}
                        </Collapse>
                    ) : null}
                </Card>
            </Base>
        </>
    );
});

export default Toaster;
```

now create our ToasterProvider:

-   create `src/providers/toasterProvider.tsx`:

```
import type { FC, PropsWithChildren } from 'react';
import { SnackbarProvider } from 'notistack';
import Toaster from '@components/ui/toaster';

const ToastProvider: FC<PropsWithChildren> = ({ children }) => (
    <SnackbarProvider maxSnack={8} Components={{ toaster: Toaster }}>
        {children}
    </SnackbarProvider>
);

export default ToastProvider;
```

now let's wrap our Providers component:

```
const Providers: FC<PropsWithChildren> = ({ children }) => (
    <SessionProvider>
        <ToastProvider>
            <StylesProvider>{children}</StylesProvider>
        </ToastProvider>
    </SessionProvider>
);
```

and one last part for our toaster puzzle, let's create a hook to ease our work:

-   create `src/hooks/useToaster.ts`:

```
import { ReactNode, useCallback } from 'react';
import { type Severity, type ExpandableContent, useSnackbar } from 'notistack';

export interface ToastConfig {
    severity: Severity;
    expandableContent: ExpandableContent;
    autoHideDuration?: number;
    transitionDuration?: number;
}

const autoHideDurationInMs = 1000;
const snackbarCloseAnimationDurationInMs = 300;

export const useToaster = () => {
    const { enqueueSnackbar } = useSnackbar();

    const showMessage = useCallback(
        (message: ReactNode, config?: Partial<ToastConfig>) =>
            enqueueSnackbar(message, {
                variant: 'toaster',
                anchorOrigin: { horizontal: 'center', vertical: 'top' },
                autoHideDuration: config?.autoHideDuration ?? autoHideDurationInMs,
                transitionDuration: { exit: config?.transitionDuration ?? snackbarCloseAnimationDurationInMs },
                severity: config?.severity, // defaults to success
                expandableContent: config?.expandableContent,
            }),
        [enqueueSnackbar]
    );
    return { showMessage };
};
```

let's see all this goodies, by first let's update the `RootLayout` and add it a mui `Container` to ease the eyes

```
import type { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { Footer } from './footer';
import Container from '@mui/material/Container';

export const RootLayout: FC = () => (
    <>
        <Container>
            <Outlet />
            <Footer />
        </Container>
    </>
);
```

and add the following to our `IndexPage.tsx` file:

```
import type { FC } from 'react';
import { useTitle } from '@hooks/useTitle';
import { useTranslation } from 'react-i18next';
import { useToaster } from '@hooks/useToaster';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useAuth } from 'src/providers/sessionProvider';
import { FunctionalLink } from '@components/ui/routing';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export const IndexPage: FC = () => {
    const { t } = useTranslation();
    useTitle(t('pages.indexPage.title'));
    const toaster = useToaster();
    const { data: sessionData, isLoggedIn } = useAuth().session;

    const username = isLoggedIn ? sessionData.user.username : t('core.currentUser.guestDisplayName');
    const greeting = t('pages.indexPage.greeting', { username });
    return (
        <>
            {greeting}
            <div style={{ marginTop: '15px' }}>
                <Alert severity="info">
                    <strong>MuiToasterSubscriber:</strong>
                    <br />
                    Note that if a toast message is displayed and you click outside of it, this toast message will
                    automatically be closed.
                    <br />
                    <br />
                    <FunctionalLink onClick={() => toaster.showMessage(greeting, { autoHideDuration: 1000000 })}>
                        trigger info toast
                    </FunctionalLink>
                    <br />
                    <FunctionalLink
                        onClick={() => {
                            toaster.showMessage(<>First: {greeting}</>, {
                                severity: 'success', // defaults to success
                                autoHideDuration: 1500, // defaults to 1000
                            });
                            toaster.showMessage(<>Second: {greeting}</>, { severity: 'error' });
                            toaster.showMessage(<>Third: ${greeting}</>);
                            toaster.showMessage(`You can also just pass a string: ${greeting}`);
                            toaster.showMessage(<>You can also pass additional content</>, {
                                severity: 'warning',
                                autoHideDuration: 5000,
                                expandableContent: (
                                    <Paper>
                                        <Typography gutterBottom variant="caption" sx={{ display: 'block' }}>
                                            Demo content
                                        </Typography>
                                        <Button size="small" color="primary">
                                            <CheckCircleIcon sx={{ fontSize: 20, pr: 4 }} />
                                            Demo action button
                                        </Button>
                                    </Paper>
                                ),
                            });
                            toaster.showMessage(<>And pass arguments as well</>, {
                                severity: 'info',
                                autoHideDuration: 100000,
                                expandableContent: (handleDismiss) => (
                                    <Paper>
                                        <Typography gutterBottom variant="caption" sx={{ display: 'block' }}>
                                            Demo content
                                        </Typography>
                                        <Button size="small" color="primary" onClick={handleDismiss} fullWidth>
                                            <CheckCircleIcon sx={{ mr: 1 }} />
                                            Demo action button
                                        </Button>
                                    </Paper>
                                ),
                            });
                        }}>
                        trigger multiple success toasts
                    </FunctionalLink>
                    <CheckCircleIcon />
                </Alert>
            </div>
        </>
    );
};
```

## 9. Nav
- create the nav layout component at `src/components/layout/nav.tsx`:
```
import { useState, type FC, type MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import { FunctionalLink, RoutingLink } from '@components/ui/routing';
import { Home } from '@mui/icons-material';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { mockedAuthenticatedUser, useAuth } from 'src/providers/sessionProvider';
import { config } from '@config/index';

const LoggedInUserMenu: FC = () => {
    const navigate = useNavigate();

    const { session, signout } = useAuth();
    const { data: sessionData, isLoggedIn } = session;
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    if (!isLoggedIn) return null;

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget);
    const closeMenu = () => setAnchorEl(null);

    const isMenuOpen = !!anchorEl;
    return (
        <>
            <Button
                id="basic-button"
                aria-controls={isMenuOpen ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={isMenuOpen ? 'true' : undefined}
                onClick={handleClick}>
                {sessionData.user.username}
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={isMenuOpen}
                onClose={closeMenu}
                MenuListProps={{ 'aria-labelledby': 'basic-button' }}>
                <MenuItem
                    onClick={() => {
                        navigate('/user-management/my-settings');
                        closeMenu();
                    }}>
                    My settings
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        signout();
                        closeMenu();
                    }}>
                    Logout
                </MenuItem>
            </Menu>
        </>
    );
};

export const Nav: FC = () => {
    const { t } = useTranslation();

    const navigate = useNavigate();

    const {
        session: { isLoggedIn },
        signin,
    } = useAuth();

    const loginUser = () => {
        signin(mockedAuthenticatedUser);
    };

    return (
        <Toolbar sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: '15px' }}>
            <RoutingLink to="/">
                <Home />
            </RoutingLink>
            <Typography component="h2" variant="h5" color="inherit" align="center" noWrap sx={{ flex: 1 }}>
                {config.companyName}
            </Typography>
            {!isLoggedIn && (
                <>
                    <FunctionalLink onClick={loginUser} noWrap variant="button" sx={{ p: 1, flexShrink: 0 }}>
                        {t('core.nav.login')}
                    </FunctionalLink>
                    <Button variant="outlined" size="small" onClick={() => navigate('/auth/register')}>
                        {t('core.nav.signUp')}
                    </Button>
                </>
            )}

            {isLoggedIn && <LoggedInUserMenu />}
        </Toolbar>
    );
};
```
and use it in the `RootLayout` component:
```
    <>
        <Nav />
        <Container>
            <Outlet />
            <Footer />
        </Container>
    </>
```
