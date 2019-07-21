---
title: 'Como customizar as tabelas do Identity Model no .Net Core 2.2'
date: 2019-07-21T09:30:44-02:00
categories: ['csharp','identity']
tags: ['Seguranca', 'Autenticacao','Usuarios', 'Identity', 'Custom Table']
language: pt
slug: como-customizar-as-tabelas-do-identity-model-no-dotnet-core2.2
image: https://i.imgur.com/XBxEGWi.png
author: José luiz
keyword: 'dotnet core, customizando tabelas do identity, mariadb identity'
excerpt: E ai developers, que tal customizar suas tabelas do identity como adicionar campos, mudar a tipo da PK para deixar sua aplicação muito mais personalizada com seu projeto? Vem comigo para entender como é fácil personalizá-las...
draft: false
---

<img src="https://i.imgur.com/XBxEGWi.png"   class="img-fluid" alt="">
\

## Intro
Fala **Developers**, tudo certo hoje? Está começando seus projetos em **.NET Core** e não sabe como customizar suas tabelas do Identity Model? ouuuu, não sabe como criar elas no banco de dados? Então, hoje quero lhe apresentar uma solução simples para que você possa customizar as tabelas do **IDENTITY** e conseguir usar esta ferramenta incrível que o **.Net** nos fornece.

O que eu quero compartilhar é uma técnica simples, você pode usar a idéa aqui e aplicar em seus projetos.

\
\

# Identity Model

\
Estou usando o **Visual Studio Code**, com a versão do .NET Core 2.2 em um banco de dados MariaDB (Docker), se você não sabe como configurar o MariaBD para trabalhar com o .NET Core, dá uma olhada no meu outro [Post](/pt/integrando-mariadb-com-aplicacoes-aspnet-core/) que vai te ajudar.


1. [Criando o Projeto MVC](#1)   
2. [Adicionando Dependencias do MariaDB](#2)   
3. [Enviando/Criando as tabelas padrões](#3) 
4. [Alterando o nome das tabelas](#4) 
5. [Alterando o tipo da chave nas tabelas](#5)
6. [Criando novos campo na tabela de usuários](#5)
7. [Dica Extra! Clean Code +](#6)


<h2 id="1">#1 Criando o Projeto</h2>

\
Estou utilizando o .NET CLI para criar os projetos já que estamos com o VS Code então para criar o projeto vamos abrir nosso console e digitar:

```cmd
 dotnet new mvc --auth Individual
```
\

* **mvc**: indica que quero criar um projeto MVC do .Net CORE, (Veja dotnet new -h para mais opções)
* **--auth Individual**: é responsável por adicionar toda a API de autenticação por usuário utilizando algum banco de dados.


Após criar o projeto você pode navegar na pasta e executar o comando, para poder rodar o projeto em https://localhost:5001/

```cmd
 dotnet run
```

Neste _template_ o .NET Core vem parametrizado para conexão no SQL Lite, o que eu não quero, então vamos adicionar toda a biblioteca do MariaDB.

\

<h2 id="2">#2 Adicionando Dependencias do MariaDB</h2>
 
\
Agora vamos adicionar as dependencias do MariaDB ao nosso projeto, este POST não é sobre isso, mas, vou deixar os comandos aqui, basta seguir os passos abaixo que não vai ter erro.

1 - Remova a biblioteca SQL Lite, (ou apenas remova dentro do arquivo .csproj)


```cmd
 dotnet remove package Microsoft.EntityFrameworkCore.Sqlite
```

2 - Adicione as dependencias do MariaDB (mesma do MySQL)

```cmd
dotnet add package Pomelo.EntityFrameworkCore.MySql
```

3 - Altere o arquivo Startup.cs para usar o MySQL(mariaDB)  
    Onde estava UseSqlLite altere para UseMySql

```cs
 services.AddDbContext<ApplicationDbContext>(options =>
                options.UseMySql(
                    Configuration.GetConnectionString("DefaultConnection")));
```

4 - Rode os comandos, para restaurar e rodar respectivamente
para verificar se o projeto não possui nenhum erro..


```cmd
dotnet restore
dotnet run
```

5 - Finalize alterando o arquivo appsettings.json para configurar a string 
de conexão com seu banco MariaDB (ou qualquer outro)

```cs
Server=localhost;User Id=root;Password=password;Database=CusomTable
```

<img src="https://i.imgur.com/2K0fNNc.png"   class="img-fluid" alt="">
 
Agora seu projeto está pronto, e nesta terceira parte vamos analisar as Tabelas padrões do Identity



<h2 id="3">#3 Enviando/Criando as tabelas padrões</h2>
 
\
Primeiro vamos criar as tabelas padrões do Identity, para entendermos como ele funciona, para isso vamos usar os comandos do EntityFramework Core, que nos ajudará a criar as tabelas utilizando Migrations, este não é nosso objetivo falar de migrations,vou escrever um post sobre isso.

Mas preciso rapidamente explicar o que é **_Migrations_** que nada mais é recurso que foi adicionado ao Entity Framework que fará todo o trabalho de criar o banco e tabelas em nosso projeto, isso mesmo, de forma **"automágica"**.

Lembra que criamos a conexão, mas não criamos o banco de dados e nem as tabelas. Vamos lá, rode o comando abaixo:

```cmd
 dotnet ef migrations add MyFistMigrationEF
```

O dotnet vai criar um pasta chamada _migrations_ em seu projeto, da uma fuçada nela, e vai entender o que o EF faz é simplismente criar um "mapa" para criação das tabelas, **não altere** estes arquivos, eu sei que dá para usar mas vamos fazer algo mais profissional aqui.


Após rodar o comando do migration, você precisa efetivar dentro do Banco de dados que você configurou na ConnectionString dentro do arquivo application.json. Para isso rode o comando abaixo que o EF o fará para você:

```cmd
 dotnet ef database update  
```
Este comando criará o DB (Se não existir) e aplicará todas as _migrations_ que você criou...


<img src="https://i.imgur.com/uFkiFgO.png"   class="img-fluid" alt="">


Se abrirmos nosso Gerenciador de DB (Estou usando o DBeaver), vemos nosso BD criado:


<img src="https://i.imgur.com/8xjKoVr.png"   class="img-fluid" alt="DB Create">
 

Mas algo não está legal, né? Se você olhar o nome das tabelas estão padrão é isso que faremos no próximo passo, alterar o nome das tabelas

 

<h2 id="4">#4 Alterando o nome das tabelas</h2>

\
Eu poderia falar que, "alterar o nome é tão fácil que roubar o doce de uma criança" mas eu não saberia, já que nunca roubei doce de criança, vai saber. Mas o que eu sei que alterar e personalizar o nome é
**extremamente fácil.**


Basta abrir o arquivo do nosso Context, neste caso o .NET CORE criou um chamado ApplicationDbContext.cs, vamos abrir ele e adicionar alguns comandos no **_OnModelCreating_** conforme abaixo


```cs
using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace CustomIdentity.Data {
    public class ApplicationDbContext : IdentityDbContext {
        public ApplicationDbContext (DbContextOptions<ApplicationDbContext> options) : base (options) { }

        protected override void OnModelCreating (ModelBuilder builder) {
            base.OnModelCreating (builder);

            //Change my AspNetUser table to User
            builder.Entity<IdentityUser> ().ToTable ("User");

            //Change my AspNetRoles to Role
            builder.Entity<IdentityRole> ().ToTable ("Role");

        }
    }
}

```

Você pode customizar todas as tabelas aqui, estou apenas alterando o nome de duas para que possa entender o processo.

Beleza, agora para efetivar dentro do Banco de Dados, basta criamos outra _Migration_ e enviar ao banco:

```cmd
dotnet ef migrations add CustomMyTables
```

Se abrir os arquivos que o .NET criou vai achar onde ele faz a alteração, novamente de uma "funçada" nos arquivos sem alterá-los...
Finalmente rode o comando abaixo para enviar ao Banco

```cmd
 dotnet ef database update   
```

Agora ao abrir o banco irá ver o nome das tabelas alteradas...


<img src="https://i.imgur.com/4JwJfTN.png"   class="img-fluid" alt="DB Create">
  
Mas ainda não está legal, ne, veja que a primary key da tabela User está como **_string_** ..
<br><br>


<img src="https://i.imgur.com/hpVcEEg.png"   class="img-fluid" alt="DB Create">
   

e eu não gosto disso, vamos alterar?
 

<h2 id="5">#5 Alterando o tipo da chave nas tabelas</h2> 

\
Para alterar a chave da tabela para INT por exemplo, vamos criar um arquivo que vai nos ajudar nos próximos passos também, este arquivo vai extender a classe _IdentityUser_.

Então crie um arquivo chamado IdentityCustomTables.cs dentro do projeto e coloque estes códigos

```cs
  using Microsoft.AspNetCore.Identity;

namespace CustomIdentity.Data {
    public class CustomUserTable : IdentityUser<int> {

    }

    public class CustomRoleTable : IdentityRole<int> {

    }
}
```

A classe IdentityUser aceita tipos genericos para determinar o tipo da chave usada nas tabelas

_Somente para ver a classe não precisa implementar nada_
```cs
  //     The type used for the primary key for the user.
  public class IdentityUser<TKey> where TKey : IEquatable<TKey>
```
Isso quer dizer que posso determinar o tipo da chave, o padrão é string, e estamos alterando para INT.
Também veja que estou alterando a chave de duas tabelas, Usuarios e Roles.


Após criar o arquivo precisamos ainda "falar" ao contexto para que "veja" que criamos este arquivo para ele o EF entender o que deve ser feito, então altere o **_ApplicationDbContext.cs_** para :
Note que alteramos também _OnModelCreating_ e passamos a classe que criamos, se não o fizer
vai receber um erro na hora de commitar as alterações.

```cs
  public class ApplicationDbContext : IdentityDbContext<CustomUserTable, CustomRoleTable, int> {

    // ... Code Hide

     protected override void OnModelCreating (ModelBuilder builder) {
            base.OnModelCreating (builder);

            //Change my AspNetUser table to User
            builder.Entity<CustomUserTable> ().ToTable ("User");

            //Change my AspNetRoles to Role
            builder.Entity<CustomRoleTable> ().ToTable ("Role");

        }
  }
``` 

Próximo passo?? Ahhh fácil, vamos criar a migration e aplicar no banco, mas espere:

### Erro!!! ###
Calma, eu sei, você recebeu o erro abaixo:

```cs
violates the constraint of type "TUser".
Unable to create an object of type "ApplicationDbContext". 
For the different patterns supported at design time, see ...
```
Isso é por que agora, estamos trabalhando com arquivo diferente no Identity, e devemos também altear no arquivo Setup.cs
para que o motor do .NET também trabalhe com o mesmo arquivo enão mais com Identity Padrão

Basta alterar de:

```cs
services.AddDefaultIdentity<IdentityUser> ()
                .AddDefaultUI (UIFramework.Bootstrap4)
                .AddEntityFrameworkStores<ApplicationDbContext> ();

```

para:

```cs
 services.AddIdentity<CustomUserTable, CustomRoleTable> ()
                .AddDefaultUI (UIFramework.Bootstrap4)
                .AddEntityFrameworkStores<ApplicationDbContext> ();

```



<img src="https://i.imgur.com/6fUbBVv.png"   class="img-fluid" alt="">
   

Mas mesmo assim, preciso remover o banco de dados e criar novamente, PORQUE???

Por que a tabela User já está relacionada com outras tabelas do Identity como **_Claim_** e temos uma decisão a tomar: 
Criamos uma migration para alterar tmabém outras tabelas ou deletamos o banco e criamos novamente ?

Como o projeto está no inicio e estamos usando o Code First logo, deletar este banco faz mais sentido! 
Até por que ele não contém dados, mas em casos reais, você deve ficar **atento**!

Para deletar o banco basta rodar o comando:

```cmd
 dotnet ef database drop
```

Vamos também remover todas as Migration, pois se aplicarmos novamente as mesmas migration, voltaremos no mesmo passo, ou seja,o EF vai criar o banco com a chave string e depois vai tentar alterar a coluna...

Basta deletar a pasta _Migrations_ do projeto

Depois de dropar o banco e deletar a pasta _migration_ podemos finalmente criar a nova migration e aplicar no banco


```cmd
 dotnet ef migrations add MyFinallCustomTable
 dotnet ef database update   
```

Ahh, como eu amo Entity Framework Core <3

Agora sim, se abrir o banco de dados, vai ver a chave como INT...


<img src="https://i.imgur.com/YHysCpM.png"   class="img-fluid" alt="">
    


<h2 id="6">#6 Criando novos campo na tabela</h2>    


Para criar novos campos, basta alterar o arquivo que criamos para alterar o tipo da chave lembra? IdentityCustomTables.cs
então basta criar os campos que deseja:


```cs
using Microsoft.AspNetCore.Identity;

namespace CustomIdentity.Data {
    public class CustomUserTable : IdentityUser<int> {

        // custom properties
        public string FirstName { get; set; }
        public byte[] Photo { get; set; }
        public string PasswordTip { get; set; }

    }

    public class CustomRoleTable : IdentityRole<int> {

    }
}

```

Claro que tem que ser properties então criar uma migration e enviar ao banco


```cmd
 dotnet ef migrations add MyFinallCustomField
 dotnet ef database update   
```


<img src="https://i.imgur.com/9gr2SsL.png"   class="img-fluid" alt="">
    
 

<h2 id="7">#7 Dica Extra! Clean Code +</h2>

* Você pode altear o tipo das colunas, colocando o tipo que deseja dentro do arquivo ApplicationDbContext.cs


```cs
        protected override void OnModelCreating (ModelBuilder builder) {
            base.OnModelCreating (builder);

            // hide code

            //custom type of column
            builder.Entity<CustomUserTable> ()
                .Property (e => e.FirstName)
                .HasColumnType ("varchar(50)").IsUnicode (false);

        }

```

* Para que seu ApplicationDbContext.cs não fique grande demais, você pode criar os arquivo de configuração do Identity em uma pasta separada e fazer a importação para o ApplicationDbContext.cs

Crie um arquivo em seu projeto IdentityMigration.cs:
```cs
  
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace CustomIdentity.Data {
    public class IdentityMigration : IEntityTypeConfiguration<CustomUserTable> {
        public void Configure (EntityTypeBuilder<CustomUserTable> builder) {
            builder.ToTable ("User");
            builder.HasKey (p => p.Id);

            builder.Property (e => e.FirstName)
                .HasColumnType ("varchar(50)").IsUnicode (false);
        }

    }

    public class RoleMigration : IEntityTypeConfiguration<CustomRoleTable> {
        public void Configure (EntityTypeBuilder<CustomRoleTable> builder) {
            builder.ToTable ("Role");
        }
    }
}
```

faça a importação na classe ApplicationDbContext.cs
   
 
```cs
   // code hide
        protected override void OnModelCreating (ModelBuilder builder) {
            base.OnModelCreating (builder);
            builder.ApplyConfiguration (new IdentityMigration ());
            builder.ApplyConfiguration (new RoleMigration ());

        }
   // code hide
```
 
\
# Conclusão

Customizar aplicação é um procedimento comum e entender a mecânica por trás disso é vital para nosso controle, felizmente o .NET Core nos deixa com um grande poder nas mãos, mas lembre-se: 

Com poder vem a responsabilidade. ;)

E ai faz **sentido** para você ?

<a href="https://github.com/shpsyte/CustomIdentity" target="_blank" class="">GitHub Project</a>


Abraççooooooooo.....
