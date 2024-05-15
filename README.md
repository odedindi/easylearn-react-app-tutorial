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
    **for all the options except for *eslint* please do not install v9, i used here the version 8.57, and *webpack-dev-server* please dont install v5, i used here 4.15.2, as there are significant breaking changes and it is too much to deal with for this tutorial for all other dependencies there shouldn't be any problem using their latest version from what i saw**

-   setup linting and prettier, run: `yarn add -D prettier eslint-plugin-prettier eslint-config-prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser`
-   create at the root a `.prettierrc` file and add the properties shown in[ marcel's tutorial](https://github.com/inkognitro/react-app-tutorial/blob/main/01-setup.md#//%20.prettierrc.js:~:text=prettierrc.js%20file%3A-,//%20.prettierrc.js,-module.exports) take the brakets and the content in the brakets but omit the `module.export =` part.

-   create at the root a `.prettierignore` file and add the following:

```
.yarn
node_modules
*.lock
```

- add the following eslint rules in package.json:
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
- add the following scripts in package.json:

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


## Available Scripts

In the project directory, you can run:

-   `yarn start`
-   `yarn test`
-   `yarn build`
-   `yarn eject`
