---
title: 'Javascript Environment for Work NodeJS'
date: 2018-12-10T11:38:44-02:00
categories: ['NodeJS']
tags: ['Setup Environment', 'Plugins', 'Eslint', 'Prettier']
language: en
slug: setup-javascript-environment-for-work-nodejs
image: https://i.imgur.com/iUnC6rO.png
author: José luiz
keyword: 'NodeJS, plugins, Eslint, Setup Environment'
excerpt: Hello, today I will share my first post about NODEJS, yes, It's amazing and power full language for back-end services, and I will share how to setup your environment with best plugins and create a project model...
draft: false
---

<img src="https://i.imgur.com/iUnC6rO.png" class="img-fluid" alt="ViewComponents">
\
## Intro
Hello guys, How do are you today? So, I  will share my first post about **NodeJS** this amazing language to backend services.

And as you know I'm starting to learn MERN (MongoDB, Express, React, Node.js), and, In this post, I will explain how I have configured my environment, Terminal and other tools that I use to increase my productivity to work with NodeJS.

I use **Linux Mint**, to developer my's software, I'm super happy, so, if you use windows, I recommend you to use Linux...

> I used windows to the developer, but after many bugs, the update fails, the performance I have decided to change Linux
> and I Loved! Open Source, Fast, Clean, Free Mind!

\
\

# Visual Studio Code

\
I'm using Visual Studio Code, because have a native integration with Git, Debug and they extension make It very fast programming, besides It's an OpenSource and free to use.

## Plugins

\
Bellow, my list of favourite plugin
\

1. [Yarn](https://yarnpkg.com/lang/en/docs/install/) - Yarn is a package manager for your code. It allows you to use and share code with other developers from around the world. Yarn does this quickly, securely, and reliably so you don’t ever have to worry.
2. [ESLint](https://marketplace.visualstudio.com/items?itemName=naumovs.color-highlight) – Plugin to ensure patter code between developers, like, ";", break lines, It's really awesome!, they have pattern's **Standart, Airbnb, Google**
3. [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) - Plugin to format your JavaScript / TypeScript / CSS. It's powerful using with EsLint
4. [Color Highlight](https://marketplace.visualstudio.com/items?itemName=naumovs.color-highlight) – Show the color in string **_RGB’s_** or **_HEX_**;
5. [DotEnv](https://marketplace.visualstudio.com/items?itemName=mikestead.dotenv) – Support to _.ENV_ syntax very useful to work with NodeJS.
6. [Dracula Official](https://marketplace.visualstudio.com/items?itemName=dracula-theme.theme-dracula) – Theme
7. [EditorConfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig) – Plugin to pattern breaking, ident, space between programmers
8. [Markdown All in One](https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one) – Help to write and read **Markdown** inside VSCode;
9. [Material Icon Theme](https://marketplace.visualstudio.com/items?itemName=PKief.material-icon-theme) – Just to show the right icons in pallet according to language
10. [Todo+](https://marketplace.visualstudio.com/items?itemName=fabiospampinato.vscode-todo-plus) - Help to remind my TODO List.
11. [Live Share](https://marketplace.visualstudio.com/items?itemName=MS-vsliveshare.vsliveshare) - Do you like to share your code LIVE with another programmer? It's amazing when you work with a team.
12. [Git History](https://marketplace.visualstudio.com/items?itemName=donjayamanne.githistory) - View git log, file history, compare branches or commits, helpful to work a Git
13. [Fire Code](https://github.com/tonsky/FiraCode) - Font to make our code more comfortable to our brain.

## Configuration

\
Ok, after install those plugins, we need to configure our VSCode to work properly, to do this, just open our
_Preferences: Open Settings(JSON)_ and configure like that:

> Attention on Editor.formateOnSave, eslint.autoFixOnSave and prettier.eslintIntegration
> Important to they work as well

```JSON
{
  "window.titleBarStyle": "custom",
  "editor.fontFamily": "'Fira Code'",
  "workbench.iconTheme": "material-icon-theme",
  "workbench.colorTheme": "Dracula",
  "workbench.editor.labelFormat": "short",
  "breadcrumbs.enabled": true,

  "editor.fontSize": 16,
  "editor.lineHeight": 24,
  "editor.fontLigatures": true,

  "editor.formatOnPaste": true,
  "editor.formatOnSave": true,
  "eslint.autoFixOnSave": true,

  "prettier.eslintIntegration": true,
  "prettier.singleQuote": true,
  "prettier.trailingComma": "none",
  "prettier.printWidth": 80,
  "prettier.bracketSpacing": true,
  "prettier.jsxBracketSameLine": true,
  "prettier.semi": false,

  "editor.rulers": [80, 120],

  "editor.renderLineHighlight": "gutter",
  "todo-tree.defaultHighlight": {
    "foreground": "green",
    "type": "none"
  },
  "editor.tabSize": 2,
  "terminal.integrated.fontSize": 14,
  "todo-tree.customHighlight": {
    "TODO": {},
    "FIXME": {}
  },
  "emmet.includeLanguages": {
    "nunjucks": "html",
    "razor": "html"
  }
}
```

# Third Tools

\
Now, to improve our power of code, below my preference tools

1. [Insomnia](https://insomnia.rest/) - Finally, a REST client you'll love.
2. [StartUML](http://staruml.io/download) - A sophisticated software modeller for agile and concise modelling
3. [Oh My Zsh](https://github.com/robbyrussell/oh-my-zsh) - Only for Mac and Linux, boost your terminal with powerful plugins. I use avit for theme and git and history for the plugin
4. [Dbeaver](https://dbeaver.io/) - Universal Database Tool

\
\

# Setup a basic Project

\
With our environment configurated, let's Create a basic Project NodeJS, so,

```cmd
yarn init -y
yarn add nodemon -D
yarn add eslint -D
```

After that, wee need initialize the EsLint, to do this,

```cmd
npx eslint --init
```

And response the answer, to **NodeJS** project I like to use :

Which style guide do you want to follow?

- Use a popular style guide

Which style guide do you want to follow?

- Standard

What format do you want your config file to be in?

- JSON

And type Y to install all dependence

So, **EsList** create a second package _package-lock.json_ just **delete** this file and type _yarn_ to restore in right file:

```cmd
yarn
```

\
Ok, now we needed create a file called _.editorconfig_ in the root of our project and type like that:

> this will configure to space ident=2 and trim space in lines code and insert a new line in the final file

```txt
root = true

[*]
indent_style = space
indent_size = 2
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
```

Create a folder call _src_ in the root, and create also your files, app.js and server.js
And don't forget to change you package.json and add nodemon

```cmd
"scripts": {
    "start": "nodemon src/app.js"
  },
```

# Final Tip

You do not need to save the node_modules folder, to send it to Git, then create a .gitignore file and add this folder as a delete, this is just one of the things I like on Node, packages simply work.

When some programmer downloads its source, it will type _yarn_ and all dependencies will be installed

```cmd
node_modules/
```

# Conclusion

Work with the right environment to developer, is the best way to boost your productivity, and I really enjoy this configuration and tools, I hope you enjoy too
