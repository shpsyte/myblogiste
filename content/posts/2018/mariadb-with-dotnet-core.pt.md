---
title: "Tudo sobre integrar banco de dados MariaBD com aplicações .Net Core"
date: 2018-11-16T14:39:43-03:00
categories: ["cSharp", ".Net Core", "MariaBD"]
tags: ["ASP.NET Core", "MariaDB"]
language: pt-br
slug: integrando-mariadb-com-aplicacoes-aspnet-core
image: https://i.imgur.com/PJ7ZJbI.png
author: José luiz
keyword: ".NET Core, MariaDB, MySQL"
excerpt: Quer integrar o famoso banco de dados MariaDB com aplicações .Net Core ? Vem comigo neste artigo que vou explicar tudo...
draft: false
---

<!-- {{< youtube w9ORoCHr_gw >}}  -->
<img src="https://i.imgur.com/PJ7ZJbI.png" class="img-fluid" alt="">
\
#### Antes de tudo...
Olá, tudo bem? Bom, antes de mais nada, eu tenho procurado sim outras tecnologias e sair um pouco da "caixinha Microsoft", ainda gosto das tecnologias como **.Net MVC, .Net Core e SQL Server,** mas reduzir o custo de servidores me chamou a atenção nos últimos anos, (Dez/2017), enfim
estou em mudanças de linguagens e tenho conseguido baixar o custo de muitos projetos.
\
\
Também tenho me envolvido em **muitos projetos Open Source,** então... :)
\
\
Então hoje vou lhe apresentar uma alternativa ao **SQL Server**, o <a href="https://mariadb.org/about/" target="_blank">MariaDB</a> , um banco "dos mesmos criadores" do MySQL que vem pegando um parcela do mercado e que tenho gostado muito de trabalhar com ele, além disso é Open Source.
\
Vamos integrar com uma aplicação **.Net Core 2.0**.
\
\
\
## Instalando o MariaDB
Primeiro precisaremos instalar o MariaDB, baixe a versão para seu sistema operacional em <a href="https://downloads.mariadb.org" target="_blank">MariaDB Downloads</a>, neste post estou a versão 10.3 e Windows.
\
\
Depois que o download estiver completo basta executar o arquivo e começar o processo de instalação. Os passos para instalação do MariaBD são muitos simples, e é super rápido!

1. Inicando a instalação 

<img src="https://i.imgur.com/K92fbu3.png" class="img-fluid" alt="">
\
Basta clicar em ***Avançar***
\
\
2. **Aqui vale destacar** a senha padrão do usuário **root** (sa do SQL SERVER)

<img src="https://i.imgur.com/xYqTHZl.png" class="img-fluid" alt="">
\
Defina a senha padrão desejada,  esta senha será usada na ***ConnectionString***
\
\
3. Na tela configuração, não precisamos alterar nada, salvo claro, se você desejar...

<img src="https://i.imgur.com/Fifo30w.png" class="img-fluid" alt="">
\
\
4. Tela de finalização da instalação

<img src="https://i.imgur.com/FaRQJzP.png" class="img-fluid" alt="">


### Pronto!, parace até auto-mágico não ?


## Aplicação .Net Core 2.0
Vamos agora criar a aplicação .Net Core 2.0, para isso usaremos o terminal.

```cmd
dotnet new mvc --name AppMariaDB --auth Individual
```

Com isso criamos um projeto MVC com autenticação individual, bom, o MariaDB é compatível com MySQL então poderemos usar o MySQL Entity Framework provider. Vamos instalar o pacote ***Pomelo.EntityFrameworkCore.MySql*** versão 2.0.1, para isso use o comando no terminal

```cmd
 dotnet add package Pomelo.EntityFrameworkCore.MySql --version 2.0.1
```

E depois efetuar um restore nos pacotes

```cmd
dotnet restore
```

Vamos alterar a classe **Startup.cs** no método **ConfigureServices** e mudar para o provedor MySQL, seu código deve ficar pareceido com:

```c#
public void ConfigureServices(IServiceCollection services)
{
     
    //Codigo novo
    services.AddDbContext<ApplicationDbContext>(options =>
        options.UseMySql(Configuration.GetConnectionString("DefaultConnection"))); 

        ///omitido

}
```

Claro precisamos mudar a ***string de conexão*** para usar nosso banco MariaDB, então abra o arquivo ***appsetings.json*** e mude o arquivo conforme abaixo, mas claro usando as suas credenciais usadas na hora da instalação. O Nome do Database é de livre escolha...

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;User Id=root;Password=<sua senha>;Database=mariadbtest"
  },
  "Logging": {
    "IncludeScopes": false,
    "LogLevel": {
      "Default": "Warning"
    }
  }
}
```

## Criando os modelos usando migrações

Agora que está tudo configurado corretamente, vamos criar o banco de dados usando o recurso de "migração" do dotnet, para isso no seu terminal escreva:

```cmd
dotnet ef migrations add FirstSrcModels
```

E aplique as mudanças no banco de dados com o comando:

```cmd
dotnet ef database update
```

Com isso efetuado, já podemos abrir o MariaDB e verificar se as tabelas foram criadas, vamos usar o HeidiSQL que instalou junto com o DB.

<img src="https://i.imgur.com/NH5HbrL.png" class="img-fluid" alt="">


Veja as tabelas criadas com sucesso.

<img src="https://i.imgur.com/6M2XsRz.png" class="img-fluid" alt="">


## Indo além, Customizando as Tabelas

O que diferencia este artigo dos demais é que nunca fico contente com o "padrão", então agora vamos customizar as tabelas do Identity para ver se realmente a integração com MariaDB é 100%!

Bom, O primeiro passo vou excluir a pasta ***Migrations*** e excluir nosso ***banco de dados***, sim faremos no zero novamente! :)
o segundo passo é abrir o arquivo ***ApplicationDbContext.cs*** que é o Contexto desta aplicação, e modificar o método OnModelCreating, deve ficar assim:

```c#
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            // Customize the ASP.NET Identity model and override the defaults if needed.
            // For example, you can rename the ASP.NET Identity table names and more.
            // Add your customizations after calling base.OnModelCreating(builder);

            //Aqui está nossa customização
            builder.Entity<ApplicationUser>().ToTable("User");
            builder.Entity<ApplicationUser>().HasKey(a => a.Id);
            builder.Entity<IdentityRole>().ToTable("Role");
            builder.Entity<IdentityUserClaim<string>>().ToTable("UserClaim");
            builder.Entity<IdentityUserRole<string>>().ToTable("UserRole");
            builder.Entity<IdentityUserLogin<string>>().ToTable("UserLogin");
            builder.Entity<IdentityRoleClaim<string>>().ToTable("RoleClaim");
            builder.Entity<IdentityUserToken<string>>().ToTable("UserToken");
            builder.Entity<IdentityUserRole<string>>().HasKey(a => new { a.UserId, a.RoleId });
            builder.Entity<IdentityUserClaim<string>>().HasKey(a => new { a.UserId, a.Id });
            builder.Entity<IdentityUserLogin<string>>().HasKey(a => new { a.UserId, a.ProviderKey });
            builder.Entity<IdentityRoleClaim<string>>().HasKey(a => new { a.RoleId, a.Id });
            builder.Entity<IdentityUserToken<string>>().HasKey(a => new { a.UserId });

        }
```

Não esqueça de colocar a referência ***using Microsoft.AspNetCore.Identity;*** para não dar erro
Depois é só criarmos um novo pacote para o migration com o comando:

```cmd
 dotnet ef migrations add NewIdentityNames
```
E finalmente enviar o pacote para o banco:
```cmd
dotnet ef database update
```


Sucesso!, se abrirmos novamente o MariaDB, veremos nossas tabelas customizadas!

<img src="https://i.imgur.com/m3wyRq0.png" class="img-fluid" alt="">
 

\
\
E apenas para ter certeza que tudo está correto, se rodarmos a aplicação e registrar um novo usuário, você poderá ver o registro dentro do Banco de Dados.



<img src="https://i.imgur.com/G9z4Hdd.png" class="img-fluid" alt="">



## Conclusão

Eu demostrei como usar o MariaDB com .Net Core 2.0 e como é fácil a customização das tabelas, eu usei o ***migration*** para provar que EF está funcionado com a Enginne do MariaDB.

Eu tenho usado em produção e tenho resultados muitos satisfatórios, incluse se quiser dar uma olhada neste projeto: [Hack The Question](http://hackthequestion.joseluiz.net) ele foi feito com MariaDB e .Net Core

O link para este projeto está no GitHUb, dá uma olhada lá... [Projeto](https://github.com/shpsyte/netcoremariadb)