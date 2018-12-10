---
title: 'Ambiente Javascript para projetos NodeJS'
date: 2018-12-10T11:38:44-02:00
categories: ['NodeJS']
tags: ['Setup Ambiente', 'Plugins', 'Eslint', 'Prettier']
language: en
slug: setup-ambiente-javascript-para-trabalhar-com-projetos-nodejs
image: https://i.imgur.com/iUnC6rO.png
author: José luiz
keyword: 'NodeJS, plugins, Eslint, Setup Ambiente'
excerpt: Olá, hoje vou compartilhar meu primeiro post sobre NODEJS, sim, esta incrível e poderosa linguagem completa para backend, e vou compartilhar meu setup e como configurar seu ambiente com os melhores plugins
draft: false
---

<img src="https://i.imgur.com/iUnC6rO.png" class="img-fluid" alt="NodeJS">
\
## Intro
Olá pessoal, tudo certo hoje? Então, vou compartilhar minha primeira postagem sobre o **NodeJS**, essa incrível linguagem para backend services.

E como você sabe, eu estou começando a aprender MERN (MongoDB, Express, React, Node.js), e, neste post, eu vou explicar como configurei meu ambiente e outras ferramentas que uso, para aumentar meu produtividade para trabalhar com o NodeJS.

Eu uso o **Linux Mint**, para desenvolver meus software, e estou super feliz, então, se você usa windows, eu recomendo que você troque para o Linux ou Mac...

> Eu usei windows para o desenvolvedor, mas depois de muitos bugs, falhas na atualização, e desempenho eu decidi mudar o Linux
> e eu amei! Código Aberto, Rápido, Limpo, Sem travamentos...

\
\

# Visual Studio Code

\
Estou usando o Visual Studio Code, é um dos editores mais usados, e possui nativa com o Git, Debug na IDE e extensão que fazem programação muito rápida, além de ser um OpenSource e livre para uso.

Os plugins e ferramentas que estou listando aqui obviamente instalei no VSCode, mas se você usa outro editor
pode procurar por lá... :)

## Plugins

\
Abaixo minha listagem dos meus plugins favoritos
\

1. [Yarn](https://yarnpkg.com/lang/en/docs/install/) - O Yarn é um gerenciador de pacotes incrível, é mais rápido , seguro e confiável, muito melhor que o npm
2. [ESLint](https://marketplace.visualstudio.com/items?itemName=naumovs.color-highlight) – Utilizado para padronizar seu código com outros desenvolvedores, como pontuação, espaçamento. Recomendo muito seu uso.
3. [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) - Plugin para formatar seu código JavaScript/TypeScript/CSS. É muito poderoso quando usado como o EsLint
4. [Color Highlight](https://marketplace.visualstudio.com/items?itemName=naumovs.color-highlight) – Mostra as cores em string **_RGB’s_** or **_HEX_**, quem usa CSS vai amar
5. [DotEnv](https://marketplace.visualstudio.com/items?itemName=mikestead.dotenv) – Adiciona suporte a syntax _.ENV_ muito usado para projetos NodeJS.
6. [Dracula Official](https://marketplace.visualstudio.com/items?itemName=dracula-theme.theme-dracula) – Thema incrível para você ão cansar seus olhos
7. [EditorConfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig) – Plugin para criar um arquivos para configurar padrões de espaçamento, espaços nas linhas
8. [Markdown All in One](https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one) – Ajuda a escrever e ler **Markdown** dentro do VSCode;
9. [Material Icon Theme](https://marketplace.visualstudio.com/items?itemName=PKief.material-icon-theme) – Mostra os ícones corretos no pallet de acordo com a linguagem
10. [Todo+](https://marketplace.visualstudio.com/items?itemName=fabiospampinato.vscode-todo-plus) - Ajuda a me lembrar das minhas tarefas.
11. [Live Share](https://marketplace.visualstudio.com/items?itemName=MS-vsliveshare.vsliveshare) - Se você trabalha com time de desenvolvimento, você pode compartilhar seu código ao vivo.
12. [Git History](https://marketplace.visualstudio.com/items?itemName=donjayamanne.githistory) - Melhora a experiência do git log, file history, compara commits, muito útil para quem trabalha com Git
13. [Fire Code](https://github.com/tonsky/FiraCode) - Fonte que deixa nosso cóidigo mais confortável ao nosso cérebro.

## Configuration

\
Ok, depois de instalar os plugins, precisamos configurar nosso **VSCode** para funcionar corretamente, para isso, basta abrir o arquivo : _Preferências: Abra Configurações (JSON)_ e configure assim:

> Atenção para as linhas Editor.formateOnSave, eslint.autoFixOnSave e prettier.eslintIntegration
> Importante para eles trabalharem bem

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

# Ferramentas de Terceiros

\
Agora, para melhorar nosso poder de código, abaixo das **minhas ferramentas preferidas**:

1. [Insomnia](https://insomnia.rest/) - Finalmente um cliente REST show de bola, serve par enviar requisições a API.
2. [StartUML](http://staruml.io/download) - Sofisticado criador de UML para exporta para uma gama de opções
3. [Oh My Zsh](https://github.com/robbyrussell/oh-my-zsh) - Apenas para **Linux** e Mac, dá um boost em seu terminal, eu uso com o tema avit, e plugins como git e history
4. [Dbeaver](https://dbeaver.io/) - Ferramentas para banco de dados universal, estilo canivete suíço

\
\

# Configurando um projeto básico

\
Com o nosso ambiente configurado, vamos criar um projeto básico do NodeJS, então, digite:

```cmd
yarn init -y
yarn add nodemon -D
yarn add eslint -D
```

Depois disso, precisamos inicializar o EsLint, para fazer isso:

```cmd
npx eslint --init
```

E responda a respostas, para projeto **NodeJS** eu gosto de usar:

Which style guide do you want to follow?

- Use a popular style guide

Which style guide do you want to follow?

- Standard

What format do you want your config file to be in?

- JSON

E digite Y para instalar toda a dependência

O **EsList** cria um segundo arquivo _package-lock.json_ apenas **delete** este arquivo e digite _yarn_ para restaurar as dependências dentro do arquivo correto:

```cmd
yarn
```

\
Ok, agora precisamos criar um arquivo chamado _.editorconfig_ na raiz do nosso projeto e deixá-lo assim:

> isto irá configurar a pasta para tabalhar com espaçamento 2 e limpar espaços desnecessário no código
> e adiciona uma linha ao final do arquivo

```txt
root = true

[*]
indent_style = space
indent_size = 2
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
```

Crie uma pasta chamada _src_ na raiz e crie também seus arquivos, app.js e server.js
E não se esqueça de mudar o package.json e chamar o nodemon

```cmd
"scripts": {
    "start": "nodemon src/app.js"
  },
```

# Última DICA

Você não precisa salvar a pasta node_modules, para enviar ao Git, então, crie um arquivo .gitignore e adicione esta pasta como exclusão, isso é apenas umas das coisas que gosto no Node, os packages simplismente funcionam.

Quando algum progamador baixar seu fonte, ele vai digitar _yarn_ e todas as dependências serão instaladas.

Parece óbvio, mas existem muitas pessoas que salvam, inclusive eu no começo

```cmd
node_modules/
```

# Conclusão

Trabalhar com o ambiente certo para desenvolver, é a melhor maneira de aumentar sua produtividade, e eu realmente gosto desta configuração e ferramentas, espero que você goste também.

\
Apartir de hoje, vou começar uma série de post sobre NodeJS, Express, Sequelize, se gostou dá um alô..
