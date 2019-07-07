---
title: 'My principles for developer software in .NET'
date: 2019-07-07T11:38:44-02:00
categories: ['csharp']
tags: ['Rules', 'Conventions', 'Environment']
language: pt
slug: my-principles-for-developer-software-in-dotnet
image: https://imgur.com/a5QXcqQ.png
author: José luiz
keyword: 'dotnet, guidlines names convention, best pratices'
excerpt: Hello, Building software does not only mean focusing on the delivery the project but rather on taking care about the code and how it will be maintained and grow, I would show in this post what I truly believe is worth!
draft: false
---

<img src="https://i.imgur.com/a5QXcqQ.png" class="img-fluid" alt="">
\
## Intro
Hello **Developers**, how it's going? So, today I'll share with you my personal rules to software development, but I won't speak about **SOLID** or **ACID** this will be to another post.

What I want to share is some rules, or maybe **principles that I really believe** when I go to make a software especially using .Net Stack

I strongly believe that you should follow it all of them.

> Those principles I made after 9 years of software development and review codes.
> I know! this can be personal, however It's valid to share...

\
\

# My Principals

\
I'm using **Visual Studio Code**, and one of the rules is related to Visual Studio, but I already open a [Issue](https://github.com/microsoft/vscode/issues/76785) on GIT and they should add this feature at VSCode.

If you could go and add a thumb! I'll appreciate that... ;)

Ahhh the principals aren't prioritized, just numbered

1. [Conventions Names](#1)   
2. [Avoid Regions](#2)   
3. [Use Exception to handle Erros](#3) 
4. [Void boolean parameters](#4) 
5. [Try to avoid many parameters](#5)
6. [Warning as Rrros](#6)
7. [Encapsulate Complex Expression](#7)
8. [Try to Avoid Multiple Exists](#8)
9. [Keep your methods short](#9)
10. [Keep yuor Classes short](#10)
11. [Prefer Interfaces instead of Abstract Class](#11)


<h2 id="1">#1 Conventions Names</h2>

\
It seems obvious, but I see "strEdit" or "edt_name" on components or field names ... Old developers always argue about nomenclature for variable names, classes, methods ... In my opinion, just follow this [Guidelines](https://docs.microsoft.com/en-us/dotnet/standard/design-guidelines/index) all of design-guideline are there done to use.
\

It's just:

<img src="https://i.imgur.com/nygoNEY.png" class="img-fluid" alt="">

\
I don't really like!


1. Name fields with initials that reference the type (strName, str_name)
2. Name elements with element type (edtName)
3. Variables with nonsense name
4. Classes with nonsense names
5. Lack of pattern! If you start with "str" for example, for some policy, do it to the end!


 
<h2 id="2">#2 Avoid Regions</h2>
 
\
Are your crazy, Jose? _Regions_ are used to facilitate navigation in a large class, and there is the problem!
If a class is large enough to have to organize with _regions_ maybe the problem is in your code.

If you have a class where you need to use regions to organize it... maybe a little OOP will solve

The tru is: Regions exists to **hide codes**, period. 


```cs
   class Customer
   {
      #region CustomerManager
      ...
      #endregion
      #region CustomerRole
      ...
      #endregion
      #region CustomerAccess
      ...
      #endregion
      #region CustomerMethods
      ...
      #endregion
   }

```


<h2 id="3">#3 Use Exception to handle Erros</h2>
 
\
In Boolean methods, use Exceptions for _handle erros_, this lets you extend and understand what is really happening. There are certain times that the flow is more indicated, Exception should be used to indicate an error in the program.

In the code below the error would probably be in the call by allowing _name_ null, but the fact is that the method returns _false_ and should in fact be an _Argument Exception_.

```cs
   public bool CheckCustomer(string name)
   {
       if (string.IsNullOrEmpty(name))
       {
         return false; 
       }
       ...
       return true;
   }

```
<h2 id="4">#4 Void boolean parameters</h2>

\
Avoid Boolean parameters, You can overloaded methods for this purpose, or even use interfaces to change behaviour of methods,but using boolean parameters isn't a good deal, you never ever know what the parameter was actually created,

see the example: What does the parameter do? Close the connection? Close the file?

```cs
   storage.Write(data, false);
```

You will know after going to the method.

```cs
   public void Write(string file, bool flush)
   {
       // ...
       
   }

```

You should create another method to handle it, see the access modifier.

```cs
   public void WriteAndFlush(string file)
   {
       Write(file, true)
       
   }

   public void Write(string file)
   {
       Write(file, false)
       
   }


   private void Write(string file, bool flush)
   {
       // ...
       
   }
```


<h2 id="5">#5 Avoid many parameters</h2> 

\
Many parameters in method make me think "What is the relationship between them?" I like to see 3 maybe 4 parameters, use a class to handle this.

Avoid:
```cs
   public void Login(string username, string password, bool persist, string ipAddress, IUser user, IUserServices services)
   {
       // ... 
       
   }
```

What could be done:

 
```cs
   public void Login(ILoginUser user)
   {
       // ... 
       
   }
```


<h2 id="6">#6 Warning as Erros</h2>    
_This tip will only works on Visual Studio._


Configure your BUILD to a treated warning as error. Remember Warnings will make your code bad and difficult to test!


<h2 id="7">#7 Encapsulate Complex Expression:</h2>

If you have a complex expression just make sure that could be a Method!

Avoid:
```cs
  
   if(login.Try > totalAllow && !login.IsVip && login.DueDate > CurrentDate)
   {
     // ..
   }
```
   
What could be done:
```cs

   if(login.IsAllowToAccess)
   {
     // ..
   }
```
 

<h2 id="8">#8 Try to Avoid Multiple Exists</h2> 

In Boolean Method try to avoid multiple exists - directly.

Avoid:
```cs
  
   if(Account > 0)
   {
     return false;
   }
   else if (IsVip)
   {
     return false;
   }
   else if (Account < 10)
   {
     return false;

   }
   else if (PastDue)
   {
     return false;

   }

   return true;

```

Is better:

```cs

   bool isValid;
  
   if(Account > 0)
   {
     isValid = false;
   }
   else if (IsVip)
   {
     isValid = false;
   }
   else if (Account < 10)
   {
     isValid = false;

   }
   else if (PastDue)
   {
     isValid = false;

   }

   return tisValid;

```

<h2 id="9">#9 Keep your methods short</h2>

Developer, this is required, keep your methods short! If you need, just create another Method with **suggestive name** and also avoid comments.


<h2 id="10">#10 Keep your Classes short</h2>

Another important point here, keep your classes short, Use abstract, interfaces, Delegates.. 
Yeah! I know the core point here is **"How small is enought?"** 

Short to someone else can understand easily your code.


<h2 id="11">#11 Prefer Interfaces instead of Abstract Class</h2>


I know it will depend on the project, what I mean here is the fact that many developers abuse to much of **abstract classes** that the code is unreadable and not functional, remember that C# does not accept multiple inheritance classes right? Thus use Interfaces, they are cool.

\
# Finally 

Building software does not only mean focusing on the delivery the project but rather on taking care about the code and how it will be maintained and grow, believe me!

I'm tired of picking projects up or re-writing projects because of poor code creation, I know why I've been like this!


Make sense to you?


Let's practice good inside codes, beauty?
