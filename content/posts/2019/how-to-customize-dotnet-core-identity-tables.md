---
title: 'Hot to custom Identity Tables Model on .Net Core 2.2'
date: 2019-07-21T09:30:44-02:00
categories: ['csharp','identity']
tags: ['Security', 'Auth','User', 'Identity', 'Custom Table']
language: pt
slug: how-to-customize-dotnet-core-identity-tables-model-on-dotnet-core2.2
image: https://i.imgur.com/XBxEGWi.png
author: José luiz
keyword: 'dotnet core, custom tables, mariadb identity model, custom table on Identity'
excerpt: Whats up! how about customizing your Identity tables, like add fields, changing the PK type? to make your application much more personalized with your project? Come with me to understand how easy is this...
draft: false
---

<img src="https://i.imgur.com/XBxEGWi.png"   class="img-fluid" alt="">
\

## Intro
Whats up **Developers**, Everything is ok today? When you start your projects in **.NET Core** and don't know how to customize your Identity Model tables? or, don't know how to create them in the database? So today I want to present you with a simple solution so you can customize the tables on **IDENTITY** and get to use this incredible tool that **NET** provides to us.

What I want to share is a simple technique, you can use the idea here and apply in your projects.

\
\

# Identity Model

\
I'm using **Visual Studio Code**, with the .NET Core 2.2 version in a MariaDB (Docker) database, if you do not know how to configure MariaBD to work with .NET Core, take a look at my other [Post](/en/using-mariadb-with-aspnet-core-application/) that will help you.


1. [Create MVC Project](#1)   
2. [Adding MariaDB Dependency](#2)   
3. [Send default table to DB](#3) 
4. [Change the name tables](#4) 
5. [Change type primary key in tables](#5)
6. [Create new field on User Tables](#5)
7. [Extra Tip! Clean Code +](#6)


<h2 id="1">#1 Create MVC Project</h2>

\
I am using .NET CLI to create the projects since we are using VS Code so, to create the project we will open our console and type:

```cmd
 dotnet new mvc --auth Individual
```
\

* **mvc**: Means that I want create a MVC project
* **--auth Individual**: Responsable for add all API with user authentication using some database.

After create the projects you can type on console to run your site

```cmd
 dotnet run
```

In this _template_ the .NET Core comes parameterized for connection in SQL Lite, which I do not want, so let's add the whole MariaDB library.

\

<h2 id="2">#2 Adding MariaDB Dependency</h2>
 
\
Now we will add the dependencies of MariaDB to our project, this POST is not about that however, I will leave the commands here, just follow the steps below that there will be no error.

1 - Remove the SQL Lite library


```cmd
 dotnet remove package Microsoft.EntityFrameworkCore.Sqlite
```

2 - Add the dependencies of MariaDB to our project

```cmd
dotnet add package Pomelo.EntityFrameworkCore.MySql
```

3 - Change the file _Startup.cs_ to use MariaDB
    Where was UseSqlLite change to UseMySql

```cs
 services.AddDbContext<ApplicationDbContext>(options =>
                options.UseMySql(
                    Configuration.GetConnectionString("DefaultConnection")));
```

4 - Run the commands, to restore and run respectively
to verify that the project has no error ..


```cmd
dotnet restore
dotnet run
```

5 - Finalize just changing the appsettings.json file to configure the string
connection with your DB MariaDB (or any other)

```cs
Server=localhost;User Id=root;Password=password;Database=CusomTable
```

<img src="https://i.imgur.com/2K0fNNc.png"   class="img-fluid" alt="">
 
Now your project is ready, and is this part that we are going to analyze the standard Identity Tables



<h2 id="3">#3 Send default table to DB</h2>
 
\
First of all, we will create the default Identity tables to understand how it works so we will use the EntityFramework Core commands which will help us create the tables using Migrations, this is not our goal "talk about migrations", I will write a post about it .

But I need to quickly explain what is **_Migrations_** that nothing else is a feature that has been added to the Entity Framework that will do all the work of creating the database and tables in our project, in an **"automagic"**.
Remember that we created the string connection, but we did not create the database or the tables. 

Come on, run the command below:

```cmd
 dotnet ef migrations add MyFistMigrationEF
```

.NET will create a folder named _migrations_ in your project, browsing!, and you will understand what EF does is simply create a "map" to create the tables, **do not change** these files, Let's do something more professional here.


After running the migration command, you need to perform within the Database that you have configured in the ConnectionString. To do this, run the command below that EF will do for you:

```cmd
 dotnet ef database update  
```

This command will create the DB (if it does not exist) and will apply all the _migrations_ that you have created ...


<img src="https://i.imgur.com/uFkiFgO.png"   class="img-fluid" alt="">


If we open our DB Manager (I'm using DBeaver), we see our DB created:


<img src="https://i.imgur.com/8xjKoVr.png"   class="img-fluid" alt="DB Create">
 

But something is not cool, right? 
If you look at the name of the tables are standard this is what we will do in the next step, change the name of the tables

 

<h2 id="4">#4 Change the name tables</h2>

\
I could say that "changing the name is so easy to steal candy from a child" but I would not know, since I have never stolen candy from a child. But what I know that changing and customizing the name is
**extremely easy.**


Just open the file of our Context, in this case .NET CORE created a called ApplicationDbContext.cs, we will open it and add some codes in **_OnModelCreating_** as below

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

You can customize all the tables here, I'm just changing the name of two, thus you can understand the process.

Ok, now to apply within the Database, just create another _Migration_ and send to the bank:

```cmd
dotnet ef migrations add CustomMyTables
```

Finally, run the command below to send to the Database

```cmd
 dotnet ef database update   
```

Now when you open the database, you will see the names of the changed tables...


<img src="https://i.imgur.com/4JwJfTN.png"   class="img-fluid" alt="DB Create">
  
But still not cool yet?, see that the primary key of the User table is **_string_** ..
<br><br>


<img src="https://i.imgur.com/hpVcEEg.png"   class="img-fluid" alt="DB Create">
   

Let's change?
 

<h2 id="5">#5 Change type primary key in tables</h2> 

\
To change the type of primary key to INT let's create one file that will help us in next step also, this file will be extend the class _IdentityUser_.

So, create a file called IdentityCustomTables.cs inside of the project and put this code:

```cs
  using Microsoft.AspNetCore.Identity;

namespace CustomIdentity.Data {
    public class CustomUserTable : IdentityUser<int> {

    }

    public class CustomRoleTable : IdentityRole<int> {

    }
}
```

The class IdentityUser accept generics types to use in primary key in tables.

_Just to show the class, do not code_
```cs
  //     The type used for the primary key for the user.
  public class IdentityUser<TKey> where TKey : IEquatable<TKey>
```

That means I can determine the key type, the default is string, and we are changing to INT.
Also see that I'm changing the key for two tables, Users and Roles.

After creating the file we need change the context to use this file so that EF understands what should be done, then change the **_ApplicationDbContext.cs_** to:

Note that we also changed _OnModelCreating_ and passed the class we created, if you do not
you will receive an error when committing your changes.

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

Next step?? Ahhh easy, let's create the migration and apply in the Database, but wait:

### Erroe!!! ###
Calm down, I know that you've got the error below:

```cs
violates the constraint of type "TUser".
Unable to create an object of type "ApplicationDbContext". 
For the different patterns supported at design time, see ...
```

This is why now we are working with different file in Identity, and we should also change in the file Setup.cs
so that the .NET engine also works with the same file and no more with Standard Identity

Just change from:
```cs
services.AddDefaultIdentity<IdentityUser> ()
                .AddDefaultUI (UIFramework.Bootstrap4)
                .AddEntityFrameworkStores<ApplicationDbContext> ();

```

to:

```cs
 services.AddIdentity<CustomUserTable, CustomRoleTable> ()
                .AddDefaultUI (UIFramework.Bootstrap4)
                .AddEntityFrameworkStores<ApplicationDbContext> ();

```



<img src="https://i.imgur.com/6fUbBVv.png"   class="img-fluid" alt="">
   

By the Way, I need to remove the database and create again, WHY??

Why is the User table already related to other Identity tables like **_Claim_** and we have a decision to make:
Do we create a migration to change other tables, or do we delete the database and create it again?

Since the project is in the beginning and we are using Code First, deleting this Database makes more sense!
Because it does not contain data, but in real cases, you should stay **awake**!

To delete the DB run the command:

```cmd
 dotnet ef database drop
```

We will also remove all Migration, because if we apply the same migration again, we will return in the same step/error, 
EF will create the DB with the key string and then will try to change the column to INT...

Just delete the project _Migrations_ folder

After drop the DB and deleting the _migration_ folder we can finally create the new migration and apply it to the bank

```cmd
 dotnet ef migrations add MyFinallCustomTable
 dotnet ef database update   
```

Ahh, I love Entity Framework Core <3

Now It's ok, if we open the Database you'll see the PK as INT... Pretty cool isn't?


<img src="https://i.imgur.com/YHysCpM.png"   class="img-fluid" alt="">
    


<h2 id="6">#6 Create new field on User Tables</h2>    


To create new fields/properties, just change the file that we created to change the type of the primary key reminds? IdentityCustomTables.cs

then just create the fields that you want:

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

Of course, it has to be properties then create a migration and send to the Database


```cmd
 dotnet ef migrations add MyFinallCustomField
 dotnet ef database update   
```


<img src="https://i.imgur.com/9gr2SsL.png"   class="img-fluid" alt="">
    
 

<h2 id="7">#7 Extra Tip! Clean Code +</h2>

* You can change the type of columns by placing the type you want within the ApplicationDbContext.cs file


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

* In order for your ApplicationDbContext.cs to not get too large you can create the Identity configuration file in a separate folder and import it into the ApplicationDbContext.cs

To do this, just create a file in your project called IdentityMigration.cs:

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

Make the Import in the ApplicationDbContext.cs Class
   
 
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
# Finally

Customizing application is a common procedure and understanding the mechanics behind it is vital to our control, fortunately the .NET Core leaves us with great power in our hands, but remember:

With power comes responsibility. ;)

Makes sense to you?

<a href="https://github.com/shpsyte/CustomIdentity" target="_blank" class="">GitHub Project</a>


Let's goooooo.....
