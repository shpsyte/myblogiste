---
title: "Working with ViewComponents in .NET Core "
date: 2018-11-24T17:50:25-02:00
categories: ["cSharp", ".Net Core"]
tags: ["ASP.NET Core", "ViewComponents", "Reusable View Components"]
language: en
slug: how-use-view-components-in-aspnet-core-application
image: https://i.imgur.com/ly9q3Cw.png
author: José luiz
keyword: ".NET Core, View Components, Reusable, .NET Core DRY, Update ViewComponent"
excerpt: ASP.NET Core lets you bundle up business functionality along with its related UI into a view component that you can reuse in throughout your application, Lets demystify this amazing tools..
draft: false
---

<img src="https://i.imgur.com/ly9q3Cw.png" class="img-fluid" alt="ViewComponents">
\
## Intro
Hello guys, how do are you today? So, today I will talk about **ViewComponents**,, this amazing feature inside .NET Core (1.0, 1.1, 2.0), if you have been developing software, probably you know about DRY (Don’t Repeat Yourself), and build the application using this concept will save our time!.


\
\
So that, I will show to you **how to transform part of your code in Component** and reuse in our application.
\
\
We will **create a three kind** of ViewComponents: and one Extra Content!!
\

1. <a href="#sh">Simple HTML</a> Required to read..;)
2. <a href="#fl">Fix List</a>
3. <a href="#rd">Read data from Database</a>
4. <a href="#uj">Update Components Using Javascript (Yeah!!!! Javascript)</a>

**As you know, I try coverage all about the subject, so, good read!**
\
\
\

<h2 id="sh">Simple HTML</h2> 

This is a basis for learning ViemComponents ok?
\
First Let's create a new project using the command line:

```cmd
dotnet new mvc --name NetCoreComponent --auth Individual
```

And to check if all good, run this command:

```cmd
dotnet run
```

After let's navigate on localhost:<port> (look all port your dotnet run)

<img src="https://i.imgur.com/JkhiXkf.png" class="img-fluid" alt="Home Page">
It's our HomePage, not big deal yet.
\
\
Now Let's create a Simple ***ViewComponents*** just return an HTML contains a message to our user...
\
\

> I use Visual Studio Code.. :)

1. Create A Folder Called **_Components_** to organize our code
2. Create a Class called **_"Simple.cs"_** inside this Folder
   Bellow my code:
3. Create a CSHTML (Check below)

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

Every Component:

- Must inherit of **_ViewComponent_** (You can create using decoration or Just end with Sufix _ViewComponent_)
- Have a support to **_DI_** (Dependency Injection )
- Must have a method **_IViewComponentResult Invoke()_** or **_IViewComponentResult InvokeAsync()_** to async
- Must have a CSHTML

> Isn't possible use IPageFilter or IAsyncPageFilter

\

\
We need to create our CSHTML, so you can choose with of this path:
\

- /Pages/Components/{View Component Name}/{View Name}
- /Views/{Controller Name}/Components/{View Component Name}/{View Name}
- /Views/Shared/Components/{View Component Name}/{View Name}

The default view name for a view component is **_Default.cshtml_**. You can specify a different view name when creating the view component result or when calling the View method.

I like to create in Views/Shared/Components/{View Component Name}/Default.cshtml path.
\
So, our component will be:
\
\
**Views/Shared/Components/Simple/Default.cshtml**
\
<img src="https://i.imgur.com/shJUCxa.png" class="img-fluid" alt="">
\
And our code:

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

### Invoking a view component as a Tag Helper

To use the **view component**, call the following inside a view that you need use

```cshtml
@await Component.InvokeAsync("Simple")
```

But It's better use **_Tag Helper_** for this add "@addTagHelper \*, NetCoreComponent" in our cshtml file (Add in "**\_ViewImports**" to enable in all CSHTML files), after that, you can call like this:

```cshtml
<vc:simple></vc:simple>
```

Now our application must show the ViewComponents;
\
\
<img src="https://i.imgur.com/kl8XGdF.png" class="img-fluid" alt="">

\
Now we know about the basic of Components, let's do something more interesting..

<h2 id="fl">Fix List</h2>

In this ViewComponents lets create another class called **Todo.cs** like this:

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

The pointer here is passing data from ViewComponents to View, so that, Let's create our CSHTML in our path:
\
Views/Shared/Components/Todo/Default.cshtml path.
\
with this code:

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

And Finally, call in our index.cshtml:

```html
<vc:todo></vc:todo>
```

Restart our app:

<img src="https://i.imgur.com/DQBz6gn.png" class="img-fluid" alt="">

It's possible to pass any data form Components to View, so, It's possible to work with parameters as well:

Change the class and inside the parameter **_str_**

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

And Finally, call in our index.cshtml:

```html
<vc:todo str="The;View;Its;Amazing"></vc:todo>
```

Restart our app:

<img src="https://i.imgur.com/Zec8o1s.png" class="img-fluid" alt="">

\
Ok, to quit kidding, Let's see Database now!
\
For this, I use MariaDB, if you don't know to integrate MariaDB with .NET Core, <a href="http://joseluiz.net/using-mariadb-with-aspnet-core-application/" target="_blank">look this</a>

\
\

<h2 id="rd">Read data from Database</h2>

In this ViewComponents lets create a another class called **TodoDB.cs** like this: (Remeber I use MariaDB)
and look! The method is **InvokeAsync** yes! We use _async_... and parameters

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

The pointer here is demonstrate using the database, so that, Let's create our CSHTML in our path:
\
Views/Shared/Components/TodoDB/Default.cshtml path.
\
with this code:

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

And Finally, call in our index.cshtml:

```html
<vc:todo-db done="true"></vc:todo-db>
```

> The name of our components is TodoDb, so, because Camel Case, we need change D for -d, if our componets called TodoWithCommercial then we call lije this vc:todo-with-commercial

Restart our app:

<img src="https://i.imgur.com/r16S3JO.png" class="img-fluid" alt="">

Just Check DB:

<img src="https://i.imgur.com/CPjVimO.png" class="img-fluid" alt="">

Ok, If we need update via javascript?


<h2 id="uj">Update Components Using Javascript</h2>

I create a simple Javascript for this purpose, first create a button on you index.html with the class, like this:

```html
<button class="update">Update</button>
<div class="row todo">
  <vc:todo-db done="true"></vc:todo-db>
</div>
```

For called, we need to create a method on Home Controller, so, Let's do! Check the syntax below for call 
the component.

```cs
        public IActionResult UpdateTodoList(bool done)
        {
            object paramets = new { done = done };
            return ViewComponent("TodoDb", paramets);
        }

```

create and import the javascript:

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

Finished, now we can update component just click on a button!

<img src="https://i.imgur.com/W9LGK8M.png" class="img-fluid" alt="">

Yes, I put _another_ via database and just click on button.. :)

## Conclusion

Work on ViewComponents It's very interesting to ensure we don't repeat code and make our application more extensible.
\
\
I have been using ViewComponents and I'm happy with the results.
\
The link to this project is in GitHub, take a look there... 
\

[Project](https://github.com/shpsyte/NetCoreWithViewComponents)
