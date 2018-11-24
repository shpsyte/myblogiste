---
title: "Trabalhando com ViewComponents no .NET Core "
date: 2018-11-24T17:50:25-02:00
categories: ["cSharp", ".Net Core"]
tags: ["ASP.NET Core", "ViewComponents", "Reusable View Components"]
language: en
slug: como-usar-view-components-em-aplicacoes-aspnet-core
image: https://i.imgur.com/KNtlyWD.png
author: José luiz
keyword: ".NET Core, View Components, Reusable, .NET Core DRY, Update ViewComponent"
excerpt: ASP.NET Core permite agregar funcionalidade de negócios junto com sua UI, relacionada em uam ViewComponent que você pode reutilizar em todo o seu aplicativo. Vamos desmistificar essas ferramentas incrível..
draft: false
---

<img src="https://i.imgur.com/KNtlyWD.png" class="img-fluid" alt="ViewComponents">
\
## Intro
Olá pessoal, tudo bem ? Então, hoje eu vou falar sobre **ViewComponents**, este incrível recurso dentro do .NET Core (1.0, 1.1, 2.0), se você tem desenvolvido software, provavelmente você sabe sobre DRY (Don't Repeat Yourself), e construir o aplicativo usando este conceito vai economizar o nosso tempo!


\
\
Então eu vou mostrar para vocês **como transformar uma parte do seu código em Componente** e reusar em qualquer parte da sua aplicação.
\
\
Nos vamos **criar 3 tipos** de ViewComponents e um conteúdo extra!!
\

1. <a href="#sh">Simples HTML</a> Leia para entender os conceitos básicos..;)
2. <a href="#fl">Lista Fixa</a>
3. <a href="#rd">Componentes Lendo do banco de dados</a>
4. <a href="#uj">Refresh Components com Javascript</a>

**Como você sabe, eu tento escrever bastante sobre o assunto, então tenha uma boa leitura**
\
\
\

<h2 id="sh">Simples HTML</h2> 

Este é o básico sobre ViemComponents ok?
\
Primeiro vamos criar um novo projeto usando a linha de comando:

```cmd
dotnet new mvc --name NetCoreComponent --auth Individual
```

E checkar se está tudo ok com a linha de comando:

```cmd
dotnet run
```

Depois vamos navegar no endereço localhost:<port>

<img src="https://i.imgur.com/JkhiXkf.png" class="img-fluid" alt="Home Page">
É somente nossa página, nada de mais ainda.
\
\
Agora vamos criar um simples ***ViewComponents*** apenas retornand um HTML contendo algum mensagem para nosso usuário.
\
\

> Estou usando Visual Studio Code.. :)

1. Crie uma pasta chamada **_Components_** para organizar nosso código
2. Crie uma classe chamada  **_"Simple.cs"_** dentro desta pasta
3. Crie um arquivo CSHTML  (veja mais abaixo)

código da class
\
```cs
using Microsoft.AspNetCore.Mvc;
namespace NetCoreComponent.Components
{
    public class Simple : ViewComponent
    {
        public IViewComponentResult Invoke()
        {
            return View();
        }
    }
}
```

Todo Componente:

- Precisa herdar da **_ViewComponent_** (Você pode criar usando decorations ou somente usando sufixo _ViewComponent_)
- Tem suporte ao **_DI_** (Dependency Injection )
- Preciso conter o método **_IViewComponentResult Invoke()_** ou **_IViewComponentResult InvokeAsync()_** 
- Precis ter um arquvo CSHTML

> Não é possível usar filtros em ViewComponents IPageFilter ou IAsyncPageFilter

\

\
Nós precismao criar nosso CSHTML, então você pode usar umas destas pastas:
\

- /Pages/Components/{View Component Name}/{View Name}
- /Views/{Controller Name}/Components/{View Component Name}/{View Name}
- /Views/Shared/Components/{View Component Name}/{View Name}

O nome default da view para a ViewComponent é **_Default.cshtml_**. 

Eu gosto de criaar minhas Views em "Views/Shared/Components/{View Component Name}/Default.cshtml".
\
Nosso componente deve ficar em:
\
\
**Views/Shared/Components/Simple/Default.cshtml**
\
<img src="https://i.imgur.com/shJUCxa.png" class="img-fluid" alt="">
\
E nosso código:

```html
<h1>Simple Component HTML</h1>
<p>Hello, please don't forget to send a message... :)</p>
<ul>
  <li>list 1</li>
  <li>list 2</li>
  <li>list 3</li>
</ul>
```

\
\

### Invocando noosso ViewComponent

Para usar nossa **view component**, vamos chamar usando o código abaixo

```cshtml
@await Component.InvokeAsync("Simple")
```

Mas é melhor usar a **_Tag Helper_** então aadicione "@addTagHelper \*, NetCoreComponent" nos arquivos cshtml que deseja usar a ViewComponents, porém (Adicione em "**\_ViewImports**" pois habilitará o uso em qualquer View), Depois você pode chamar assim: 

> "@addTagHelper \*, <nome_do_seu_projeto>"

```cshtml
<vc:simple></vc:simple>
```

Agora nossa aplicação consegue renderizar nosso componente;
\
\
<img src="https://i.imgur.com/kl8XGdF.png" class="img-fluid" alt="">

\
Agora que sabemos o básico, vamos criar algo mais interessante.

<h2 id="fl">Lista Fixa</h2>

Para este ViewComponent vamos criar outra classe chaaada **Todo.cs**:

```cs
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

namespace NetCoreComponent.Components
{
    public class Todo : ViewComponent
    {
        public IViewComponentResult Invoke()
        {
            return View(new List<string>() { "First", "Second", "Thirth", "Fourth" });
        }
    }
}

```

O ponto aqui é passar informação do ViewComponents para a View, então vamos criar nosso CSHTML na pasta:
\
"Views/Shared/Components/Todo/Default.cshtml"
\
Com este código:

```html
@model IEnumerable<string>
  <h1>Fix List</h1>
  <ul>
    @foreach (var item in Model) {
    <li>@item</li>
    }
  </ul>
</string>
```

E finalmente chamar em nossa index.cshtml:

```html
<vc:todo></vc:todo>
```

Reiniciando nossa aplicação:

<img src="https://i.imgur.com/DQBz6gn.png" class="img-fluid" alt="">

É possível passar qualquer infromação do Componente para a View e é possível usar parametros normalemente:

Mude a classe e adiciona o parâmetro **_str_**

```cs
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

namespace NetCoreComponent.Components
{
    public class Todo : ViewComponent
    {
        public IViewComponentResult Invoke(string str)
        {
            string[] all = str.Split(new char[] { ';' });
            return View(all);
        }
    }
}

```

Para passar os parâmetros use desta forma:

```html
<vc:todo str="The;View;Its;Amazing"></vc:todo>
```

Reinicie a aplicação:

<img src="https://i.imgur.com/Zec8o1s.png" class="img-fluid" alt="">

\
Ok, vamos parar de brincar aqui, vamos integrar com Banco de Dados!
\
Para isso eu esotu usando MariaDB, se você não sabe como integrar MariaDB com .NET Core, <a href="http://joseluiz.net/using-mariadb-with-aspnet-core-application/" target="_blank">leia isso</a>

\
\

<h2 id="rd">Componentes Lendo do banco de dados</h2>

Nesta ViewComponents vamos criar outra classe chamada **TodoDB.cs** com este código:
Veja vamos usar o método **InvokeAsync** Sim, usaremos _async_... com parâmetros

```cs
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NetCoreComponent.Data;
using NetCoreComponent.Models;

namespace NetCoreComponent.Components
{

    public class TodoDb : ViewComponent
    {
        private readonly ApplicationDbContext db;

        public TodoDb(ApplicationDbContext context) => this.db = context;

        public async Task<IViewComponentResult> InvokeAsync(bool done)
        {
            var items = await GetItemsAsync(done);
            return View(items);
        }

        private Task<List<TodoList>> GetItemsAsync(bool done)
        {
           db.TodoList.Where(a => a.done == done).ToListAsync();
        }
    }
}

```

O ponto aqui é mostrar usando Components com banco de dados, então vamos criar nosso CSHTml:
\
Views/Shared/Components/TodoDB/Default.cshtml.
\
Com este código

```html
@model IEnumerable<TodoList>
  <h1>My Todo List DB</h1>
  <ul>
    @foreach (var item in Model) {
    <li>@item.task</li>
    }
  </ul>
</TodoList>
```

E finalmente chamar em nosso arquivo index.cshtml:

```html
<vc:todo-db done="true"></vc:todo-db>
```

> O nome do nosso componente é 'TodoDb', então por cause do CamelCase, nós precisamosmudar 'D' for '-d', se nosso componente chamasse 'TodoWithCommercial' então chamaríamos assim 'vc:todo-with-commercial'

Reinicie a aplicação

<img src="https://i.imgur.com/r16S3JO.png" class="img-fluid" alt="">

Apenas para checkar no banco de dados

<img src="https://i.imgur.com/CPjVimO.png" class="img-fluid" alt="">

Ok, E se precisarmos fazer um refresh via javascript?


<h2 id="uj">Refresh Components com Javascript</h2>

Eu criei um arquivo simples Javascript para este propósito, primeiro crie um botão na página index.cshtml com a class _update_. parecido com:

```html
<button class="update">Update</button>
<div class="row todo">
  <vc:todo-db done="true"></vc:todo-db>
</div>
```

Para atualizar, precisamos criar um método no nosso Home Controller, então veja como ficou, veja que neste caso estamos chamando o componente pelo nome exato;

```cs
    public IActionResult UpdateTodoList(bool done)
    {
        object paramets = new { done = done };
        return ViewComponent("TodoDb", paramets);
    }

```

criand e importando o javascript:

```javascript

let btn = document.querySelector(".update");
let divEle = document.querySelector(".todo");

   btn.addEventListener("click", (e) => {
  e.preventDefault();

  let url = "/Home/UpdateTodoList?done=true";
  divEle.innerHTML = "Update...";
  btn.disabled = true;

  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);

  xhr.addEventListener("load", () => {
    if (xhr.status === 200) {
      divEle.innerHTML = xhr.responseText;
      btn.disabled = false;
    }
  });

  setTimeout(() => xhr.send(), 1500);

});


```

Terminamos, agora nós podemos efetuar um update nos dados do Componente!

<img src="https://i.imgur.com/W9LGK8M.png" class="img-fluid" alt="">

Sim, eu coloquei _another_ via database e somente cliquei no botão.. :)

## Conclusão

Trabalhar com ViewComponents é muito fácil e interessante para assegurar que não repetiremos códigos em nossa aplicação, e com certeza deixaremos nosso código mais extensível e resutilisável.
\
\
Eu tenho trabalhado com ViewComponents e estou muito feliz com os resultados.
\
O link para o projeto está no GitHub, de uma olhada nele
\
[Project](https://github.com/shpsyte/NetCoreWithViewComponents)
