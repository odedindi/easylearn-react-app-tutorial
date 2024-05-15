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
