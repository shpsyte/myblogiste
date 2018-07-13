---
title: "Trabalhando com Value Objects em .Net Core 2.0"
date: 2018-05-02T10:57:38-03:00
categories: ["Entity Framework", "cSharp", ".Net Core"]
tags: ["Entity Framework","EF","ASP.NET Core", "Value Objects"]
language: pt-br
slug: trabalhando-com-value-objects-aspnet-core
author: José Luiz
image: https://i.imgur.com/ms6ChkG.png
keyword: "Entity Framework Core, Value Objects, DDD, Domínios Ricos"
excerpt: Olá, hoje eu quero falar com você sobre Value Objects em .net Core, um conceito do Design Pattern que vem resolver um problema que ocorre com frequência em nosso projeto de software.
draft: false
---

 {{< youtube mRj7HebLAGk >}}

<br>

#### Value Objects no .Net Core 2.0
Olá, hoje eu quero falar com você sobre **Value Objects** em .net Core, um conceito do *Design Pattern* que vem resolver um problema que ocorre com frequência em nosso projeto de software.

<Br>
#### O problema
Deixar a obsessão por **tipos primitivos!** (*string, int, decimal*) e implementar domínios e classes que sejam: *Escaláveis, ricos com código limpo*, e onde possamos **reaproveitar nosso código** em diversas partes do nosso projeto.

> **Reaproveitamento de código**, esta ai uma excelente maneira de ganharmos **PRODUTIVIDADE!**.

<br>
#### O que é Value Objects
Basicamente são objetos (classes) sem uma identidade conceitual e são imutáveis, e dão uma característica a algum outro objeto ou classe, mas o que importa para nós agora é o que eles podem fazer.


<br>
#### Nosso Código de Exemplo 
O que tem de errado na classe de **Clientes** abaixo ?

```csharp
public class Customer
{
    ///... construtor da classe

    public int Id { get; private set; }
    public string FirstName { get; private set; }
    public string LastName { get; private set; }
    public string DocumentNumber { get; private set; }
    public string Address { get; private set; }
    public string Email { get; private set; }
    public bool isValidDoc => !string.IsNullOrEmpty(this.DocumentNumber);
}
```
A primeira vista nada, mas ela tem uma forte dependência a tipo primitivos, como ***string***.

Agora veja nossa classe de **Fornecedores**

```csharp
public class Supplier
{
    ///... construtor da classe

    public int Id { get; private set; } 
    public string FirstName { get; private set; }
    public string LastName { get; private set; }
    public string DocumentNumber { get; private set; }
    public string Email { get; private set; }   
    public string MethodShipping { get; private set; }
    public decimal ValueAddOrder { get; private set; }
    public decimal SecurityPrice { get; private set; }
    public bool isValidDoc => !string.IsNullOrEmpty(this.DocumentNumber);
}
```


Notou que algumas propriedades são comuns a elas, como por exemplo:

* FirstName
* LastName
* Email
* **isValidDoc**

Estas propriedades, além de serem **comuns a outras classes**, tem um forte apelo a validações, como email e nomes, documentos.

Imagine se tiver que mudar a regra de *validação do documento* por exemplo, teríamos que alterar em todas as classes, eu sei que exitem várias outras maneiras de abordar esta estratégia é a forma de como o **Value Objects** vai te ajudar a deixar um **Código Clean**, **Reaproveitar Métodos e Propriedades**, além de **Enriquecer seu domínio**.


<br>
#### 1. Criando nossos VO's
Vamos criar nossas classes VO (Value Objects) devidamente organizado em nosso projeto, chamado
***Name, Document, EmailAddress*** conforme abaixo:


```csharp
public class Name
{
    ///... construtor da classe
    public string FirstName { get; private set; }
    public string LastName { get; private set; }
}
```

```csharp
public class Document
{
    ///... construtor da classe
    public string DocumentNumber { get; private set; }
    public bool isValidDoc => !string.IsNullOrEmpty(this.DocumentNumber);
}
```

```csharp
public class EmailAddress
{
    ///... construtor da classe
    public string Email { get; private set; }
    public bool isValidEmail => !string.IsNullOrEmpty(this.Email);
}
```

Agora basta substituirmos nossos **tipos primitivos**, por nossos **tipos complexos**, veja como fica a nossa classe *Clientes e Fornecedores* &nbsp; ficam muito mais limpas.
```csharp
public class Customer
{
    ///... construtor da classe

    public int Id { get; private set; }
    public Name Name { get; private set; }
    public Document Document { get; private set; }
    public Email Email { get; private set; }
}
```

```csharp
public class Supplier
{
    ///... construtor da classe

    public int Id { get; private set; } 
    public Name Name { get; private set; }
    public Document Document { get; private set; }
    public Email Email { get; private set; }
    public string MethodShipping { get; private set; }
    public decimal ValueAddOrder { get; private set; }
    public decimal SecurityPrice { get; private set; }
}
```

Além de manter um código limpo, minhas validações ficaram centralizadas, ou seja, se eu precisar mudar a regra de validação, basta ir na classe *Email.cs* e alterar a regra lá..


<br>
#### 2. Manter Value Objects como tipos de entidade própria no EF Core 2.0
Ainda falta configuramos o Entity Framework para "entender" que as nossa VO's não são uma tabela
mapeada dentro do banco de dados, para isso em nossa classe de *contexto* vamos adicionar algumas linhas:


```csharp
 public class Context : DbContext{
        protected override void OnModelCreating(ModelBuilder modelBuilder) {

           /// Mapeamento da VO
           modelBuilder.Entity<Customer>().OwnsOne(p => p.Name)
             .Property(p=>p.FirstName).HasColumnName("FirstName");
          
           modelBuilder.Entity<Customer>().OwnsOne(p => p.Name)
             .Property(p=>p.LastName).HasColumnName("LastName");

             ....

          base.OnModelCreating(modelBuilder);
        } 

        ...
  }
```

Confesso que o simples fato de não referenciar como um ***DbSet< classe >***  já deveria ser suficiente para que o EF Core entendesse o seu uso, ou que ele usaria o nome da Propriedade como nome da coluna, assim não precisaríamos também adicionar 
***.Property(p=>p.LastName).HasColumnName("LastName");***

Mas pensando por outro lado, fica até mais documentado desta forma, além de que estou adotando as propriedades do fluent API como, HasKey, HasColumnName como prática em meus projetos.

<br>
Bom no código anterior o método  **.OwnsOne(o => o.Name)** especifica que a propriedade *Name* é uma proridade da classe *Customer* e não terá uma idendiade relacional (***Name*** sozinha não quer dizer nada).

Por padrão, os nomes das colunas (por convenção) da classe master (por assim dizer) será adotada como:
**EntityProperty_OwnedEntityProperty**. Portanto, as propriedades internas de *Name* aparecerão na tabela *Customer* com os nomes Name_FirstName, Name_LastName.

Você pode acrescentar o método fluente ***Property().HasColumnName()** para renomear as colunas.



<br>
### Resumo
O **Value Objects** é uma parte do *Design Pattern* que vem resolver este tipo de problema, ele e conceitos como DRY fazem nosso porjeto ser cada vez mais Escalável, Limpo e permite que qualquer programador familiarizado com DDD consigam entender e manter nosso projeto.

É isso. :) 

Você pode ver ou baixar o código-fonte do seguinte link do 
<a href="https://github.com/shpsyte/.NetCore">GitHub </a>



