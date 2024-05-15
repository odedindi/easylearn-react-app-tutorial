# react-app-tutorial

The purpose of this app is juice up Marcel's app just a bit, with a bit different folder structure and code splitting principles, utilizing third party services (avoiding setting up a toaster service from scratch for example) as well as other react best practices

## 1. setup

_i rather use yarn or pnpm_ read more [here](https://www.knowledgehut.com/blog/web-development/yarn-vs-npm) and [here](https://hackernoon.com/choosing-the-right-package-manager-npm-yarn-or-pnpm) let's use yarn [berry](https://github.com/yarnpkg/berry) cause it has a great tools that come out of the box like out install required types libraries as well as an easy to use dependency upgrade tool.

- if you do not have yarn install better install it globally by running: `npm install -g yarn`
- create a folder and access it using your terminal
- run: `yarn create react-app . --template typescript`
  _when using yarn i like better using the berry version_
- run: `yarn set version berry`
- add `nodeLinker: node-modules` in you new .yarnrc.yml file so the file looks like this:

```
nodeLinker: node-modules
yarnPath: .yarn/releases/yarn-4.2.2.cjs
```
- run: `yarn` to install all the dependencies using our new packageManager
- the file `.yarn/install-state.gz` is for local usage and so we do could and should add it to our .gitignore file 

*as I know that in step 2.7 we intend on ejecting and customizing the webpack config file to ramp up our import paths, it is better to already do it now*

*as we have untracked files we can not yet eject, let's commit our work so far`
- git add . && git commit -m "init"

## Available Scripts

In the project directory, you can run:

- `yarn start`
- `yarn test`
- `yarn build`
- `yarn eject`
