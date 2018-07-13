---
title: "Como aplicar filtros automáticos a nível de classe usando o Global Query Filters"
date: 2018-03-09T08:00:22-03:00
categories: ["Entity Framework", "cSharp"]
tags: ["Entity Framework","EF","ASP.NET Core"]
language: pt-br
slug: como-usar-global-query-filters-em-aplicativos-dotnet-core
author: José Luiz
image: https://i.imgur.com/6auDLTq.png
keyword: "Entity Framework Core, Global Query"
excerpt: Olá galera, vocês conhecem este recurso Global Query Filters ?, Ele nos permite especificar um filtro em nível do modelo e é aplicado automaticamente a todas as consultas que são executadas no contexto..
draft: false
---

 {{< youtube nPN9dWpQbgI >}}

#### Global Query Filters em .Net Core 2.0
Olá galera, vocês conhecem este recurso **Global Query Filters ou Model-Level Query Filter**?, Ele nos permite especificar um filtro em nível do modelo e é aplicado automaticamente a todas as consultas que são executadas no contexto.


#### O problema
Imaginem que vocês queiram sempre mostrar apenas registros **"Não Deletados"**, do seu banco, então sempre seu programador tem que enviar um filtro, por exemplo:

```csharp
  db.Customer.Where(a => a.deleted == false);
```

> Em alguns casos, sim: seus usuários "pensam" que deletam registros mas no final você apenas esconde o registro controlando por uma coluna chamada por exemplo "Deletado".

 
 <br>
 <p>Para evitar que seus programadores esquecem de sempre passar o filtro no EF, ou sempre tenham que adicionar o filtro, você pode fazê-lo em nível de modelo. Normalmente, estes filtros são aplicados no método de contexto **OnModelCreating**. Esses filtros também são aplicados automaticamente às consultas LINQ.</p>

Os usos comuns deste recurso são:

* Soft-Delete: O aplicativo nunca mostra dados excluídos e seus programadores não se preocupam com isso.
* Multi-tenancy: Filtro para Multi-Tenancy.

#### Exemplo
O exemplo a seguir mostra como aplicar este filtro para implementar **Soft-Delete**. 
Esout usando o <a href="http://www.joseluiz.net/guia-para-desenvolvedores-aprenderem-a-usar-o-localdb/" target="_blank"> localDB </a> (Recurso do SQL SERVER EXPRESS), então eu criei uma tabela chamado Customer e fiz alguns insert, e na coluna "Deleted" deixei um registro marcado como excluido.

```sql
Drop table Customer
GO
Create Table Customer
(
  id int identity (1,1) primary key,
  Name varchar(150),
  Deleted bit
)
GO
INSERT [dbo].[Customer] ([Name], [Deleted]) VALUES (N'Jose', 1)  
INSERT [dbo].[Customer] ([Name], [Deleted]) VALUES (N'Joao', 1)  
INSERT [dbo].[Customer] ([Name], [Deleted]) VALUES (N'Fernanda', 1)  
INSERT [dbo].[Customer] ([Name], [Deleted]) VALUES (N'Anna', 0)  
GO
Select * from Customer
```

<img src="/images/CreateTable.png" class="img-fluid" alt="Create Table">

### 1. Definir nossa Entidade

Customer.cs
```csharp
namespace GlobalFilter
{
    public class Customer
    {
        public int id { get; set; }
        public string Name { get; set; }
        public bool Deleted { get; set; }
    }
}
```


### 2. Definir nosso contexto  

MyContext.cs

```csharp

namespace GlobalFilter
{
    public class MyContext : DbContext
    {
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer(@"Data Source=(LocalDb)\MSSQLLocalDB;Initial Catalog=aspnet-db;Integrated Security=SSPI;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }


        public DbSet<Customer> Customer { get; set; }

    }
}
```
 

### Próximo passo, configure o método OnModelCreating 
Agora resta apenas alterar o método **OnModelCreateing** do nosso contexto, usando a *API HasQueryFilter*, podemos aplicar nosso filtro de entidade.

```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    ///Aplica o filtro automatico
    modelBuilder.Entity<Customer>().HasQueryFilter(p => p.Deleted == true );
    base.OnModelCreating(modelBuilder);
}
```
 

A expressão passada no método HasQueryFilter é aplicada automaticamente a qualquer consulta do LINQ.

#### exemplo

```csharp
 class Program
    {
        static void Main(string[] args)
        {
            var db = new MyContext();
            
            Console.WriteLine("Global Filter Test!");
            var customer = db.Customer.ToList();
           
            foreach (var item in customer)
            {
                Console.Write($" Name : { item.Name }   \n");
            }
            Console.ReadLine();
        }
    }

```

Saída

<img src="/images/outputfilter.png" class="img-fluid" alt="Filtro Aplicado">


#### Desativando filtros globais
Os filtros globais são aplicados usando qualquer consulta LINQ. Em alguns casos, não precisamos destes filtros. Os filtros globais podem ser desativados usando o método *IgnoreQueryFilters()*.
Por exemplo, imagine se você possui uma View chamada (Recuperar do Lixo).

Exemplo

```csharp
var customer = db.Customer.IgnoreQueryFilters().ToList();

foreach (var item in customer)
{
    Console.Write($" Name : { item.Name }   \n");
}
Console.ReadLine();
```

Saída

<img src="/images/outputnofilter.png" class="img-fluid" alt="Nenhum Filtro Aplicado">





### Limitações
Infelizmente existem algumas limitações:

* Não pode conter referências a propriedades de navegação
* Método *IgnoreQueryFilters* ignora todos os filtros do Tipo Global QUery Filter; ou seja, não podemos remover filtros especificos

### Resumo
O **Global Query Filters ou Model-Level Query Filter** é uma característica muito útil introduzida no EF. Isso nos ajuda a aplicar filtros em tipos de entidade que um desenvolvedor pode esquecer durante o desenvolvimento.

É isso. :) 

Você pode ver ou baixar o código-fonte do seguinte link do <a href="https://github.com/shpsyte/EntityFramework/tree/master/GlobalFilter">GitHub </a>



