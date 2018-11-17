---
title: "All about how to use database MariaBD with .Net Core 2.0 application"
date: 2018-11-16T14:39:43-03:00
categories: ["cSharp", ".Net Core", "MariaBD"]
tags: ["ASP.NET Core", "MariaDB"]
language: en
slug: using-mariadb-with-aspnet-core-application/
image: https://i.imgur.com/IerCkDj.png
author: José luiz
keyword: ".NET Core, MariaDB, MySQL"
excerpt: You want use MariaDB database with .Net Core applications? Come with me in this article and I will explain everything ...
draft: false
---

<!-- {{< youtube w9ORoCHr_gw >}}  -->
<img src="https://i.imgur.com/IerCkDj.png" class="img-fluid" alt="">
\
#### Before...
Hi, Is it all good? Well, before the start, I have been searching for other technologies and getting out of "Microsoft", yes, I still like those technologies such as **.Net MVC, .Net Core and SQL Server,** but reduce the cost in my server, catch me my attention since Dec / 17, I'm changing my languages and get to be successful at lower cost in projects.
\
\
I've also gotten involved in ** many Open Source projects, ** then ... :)
\
\
So today I'll introduce you to an alternative to **SQL Server**, the <a href="https://mariadb.org/about/" target="_blank"> MariaDB </a>, a database "the same creators" of MySQL that has been taking a parte of the market and that I have really enjoyed working with it, in addition, it is Open Source.
\
Let's integrate with a **Net Core 2.0 application.**
\
\
\
## Install MariaDB
First we will need to install MariaDB, download the version for your operating system in <a href="https://downloads.mariadb.org" target="_blank"> MariaDB Downloads </a>, in this post I am version 10.3 and Windows .
\
\
After the download is complete just run the file and begin the installation process. 
The steps for installing MariaDB are SUPER simple, and it's SUPER fast!

1. Starting the installation

<img src="https://i.imgur.com/K92fbu3.png" class="img-fluid" alt="">
\
Just click on  ***Next***
\
\
2. **Here attention** the password default fot the user **root**  

<img src="https://i.imgur.com/xYqTHZl.png" class="img-fluid" alt="">
\
Define the password, this will be used on ***ConnectionString***
\
\
3. This is a Step to configure MariaDB, you no needed change nothing, only if you want...

<img src="https://i.imgur.com/Fifo30w.png" class="img-fluid" alt="">
\
\
4. Finishing the installation

<img src="https://i.imgur.com/FaRQJzP.png" class="img-fluid" alt="">


### Done!, Isn't easy ?


## Application .Net Core 2.0
Now, Let's create an application .Net Core 2.0, for this we will use the terminal.

```cmd
dotnet new mvc --name AppMariaDB --auth Individual
```

With this we create an MVC project with individual authentication, well, MariaDB is compatible with MySQL so we can use the MySQL Entity Framework provider. Let's install the package *** Pomelo.EntityFrameworkCore.MySql *** version 2.0.1, for this use the command in the terminal

```cmd
 dotnet add package Pomelo.EntityFrameworkCore.MySql --version 2.0.1
```

And aftere, just restore the package

```cmd
dotnet restore
```

Lest change the class **Startup.cs** on method  **ConfigureServices** and change to provider MySQL, your code will be like this:

```c#
public void ConfigureServices(IServiceCollection services)
{
     
    //Codigo novo
    services.AddDbContext<ApplicationDbContext>(options =>
        options.UseMySql(Configuration.GetConnectionString("DefaultConnection"))); 

        ///omitido

}
```

Of course, we need change ***connection string*** to use our database MariaDB, so open the file ***appsetings.json*** and change the file as below, but using your credentials used at the time of installation. The Database Name is of free choice ...

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

## Create a Models

Everything is now configured correctly in our application, so let’s create the database migration scripts, for that type in terminal:

```cmd
dotnet ef migrations add FirstSrcModels
```

And apply with:

```cmd
dotnet ef database update
```

With that done, we can already open MariaDB and check if the tables were created, we will use the HeidiSQL that installed together with the DB.

<img src="https://i.imgur.com/NH5HbrL.png" class="img-fluid" alt="">


Look the tables created.

<img src="https://i.imgur.com/6M2XsRz.png" class="img-fluid" alt="">


## Lets going to beyond

What differentiates this article from others is that I'm never happy with the "standard", so now let's customize the Identity tables to see if the integration with MariaDB really is 100%!

Well, first lets exclude the folder ***Migrations*** and our database ***banco de dados***, yes, we will create from scratch! :)
The second step is open the file ***ApplicationDbContext.cs*** which is the Context of this application, and change the OnModelCreating method, should look like this:

```c#
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            // Customize the ASP.NET Identity model and override the defaults if needed.
            // For example, you can rename the ASP.NET Identity table names and more.
            // Add your customizations after calling base.OnModelCreating(builder);

            //here our customization
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

Do not forget to put the reference ***using Microsoft.AspNetCore.Identity;*** for no errors
Then we just create a new migration package with the command:

```cmd
 dotnet ef migrations add NewIdentityNames
```

And finally, send to database:
```cmd
dotnet ef database update
```


Success!, if open again our DB, we will see the custom table!

<img src="https://i.imgur.com/m3wyRq0.png" class="img-fluid" alt="">
 

\
\
And sure enough, if I run the application and register a new user, you can see the user being added to the ***user*** table:



<img src="https://i.imgur.com/G9z4Hdd.png" class="img-fluid" alt="">



## Conclusion

I have shown how to use MariaDB with .Net Core 2.0 and how easy it is to customize the tables, I used ***migration*** to prove that EF is running with MariaDB Enginne.

I have been using it in production and I'm happy with the results, and if you want to take a look at this project: [Hack The Question](http://hackthequestion.joseluiz.net) it was made with MariaDB and .Net Core 2.0

The link to this project is in GitHUb, take a look there... [Project](https://github.com/shpsyte/netcoremariadb)