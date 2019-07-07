---
title: 'Meus príncipios para developer software em .NET'
date: 2019-07-07T11:38:44-02:00
categories: ['csharp']
tags: ['Regras', 'Convenções', 'Ambiente']
language: pt
slug: meus-principios-para-desenvolvimento-de-software-em-dotnet
image: https://i.imgur.com/w9GZdUp.png
author: José luiz
keyword: 'dotnet, convenções de nomes, boas práticas'
excerpt: Olá, Construir aplicações não significa apenas focar no objetivo final, mas sim em preocupar-se com o código e como ele será mantido, quero mostrar neste post o que eu realmente acredito!
draft: false
---

<img src="https://i.imgur.com/w9GZdUp.png" class="img-fluid" alt="">
\
## Intro
Fala **Deve**, tudo certo hoje? Então, hoje vou compartilhar com vocês minhas regras pessoais para desenvolvimento de software, mas não vou falar de **SOLID** não, ou **ACID** isso fica para outro post.

O que eu quero compartilhar é as regras, ou melhor dizendo **príncipios que eu fielmente** sigo quando vou desenvolver algum software, em especial usando framework .NET

Eu acredito fortamente que você também deveria seguir alguns, se não todos.

> Estes princípios eu criei após 9 anos desenvolvendo software e revisando códigos.
> Eu sei, isso pode ser pessoal, mas enfim.. acho válido compartilhar....

\
\

# Meus Princípios

\
Estou usando o **Visual Studio Code**, uma regra esta vinculada ao Visual Studio, mas eu já abri um [Issue](https://github.com/microsoft/vscode/issues/76785) no GIT para que possam adicionar a feature no VSCode que é um dos editores mais usados.

Se puder ir lá e adicionar algum comentário e clicar no thumb... ;)

Ahhh os princípios não estão priorizadas, apenas numeradas.

1. [Convenções para nomes](#1)   
2. [Evite Regions](#2)   
3. [Use Exception para Erros](#3) 
4. [Evite parâmetros boleano](#4) 
5. [Evite muitos parâmetros](#5)
6. [Warning como erros](#6)
7. [Encapsulate Expressões Complexas](#7)
8. [Tente evitar multiplas saídas diretas](#8)
9. [Mantenha seu métodos pequeno](#9)
10. [Mantenha suas classes pequena](#10)
11. [Prefira Interfaces a Abstract Class](#11)


<h2 id="1">#1 Convenções para nomes</h2>

\
Parece óbvio, mas o que eu vejo de "strEdit" ou "edt_nome"... Velhos desenvolvedores sempre discutem sobre nomenclatura de nomes de variáveis, classes, métodos... Na minha opinião basta seguir este [Guidelines](https://docs.microsoft.com/en-us/dotnet/standard/design-guidelines/index) lá tem todas as diretrizes necessárias para usar.
\

Mas basicamente:

<img src="https://i.imgur.com/nygoNEY.png" class="img-fluid" alt="">

\
O que eu realmente não gosto e não faço!


1. Nomear campos com iniciais que referenciam o tipo (strNome, str_nome)
2. Nomear elementos com o tipo do elemento (edtNome)
3. Variaveis com nome sem sentido, exceto para loop!
4. Classes com nome sem sentido
5. Falta de coerencia no padrão! Se começar com "str" por exemplo, por alguma política, faça-o até o fim!
\


 
<h2 id="2">#2 Evite Regions</h2>
 
\
Como assim!, Jose você está louco! _Regions_ são usado para facilitar a navegação em uma class grande, e ai está o problema!
Se um arquivo é grande o bastante para ter que organizar com regions talvez o problema esteja no seu código.
Se você tem uma classe onde precisa usar regions para se encontrar lá... talvez um pouco de OOP resolva

Mas a verdade é que eles existem apenas para **esconder códigos**, ponto final. 


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


<h2 id="3">#3 Use Exception para Erros</h2>
 
\
Em métodos booleanos, use Exceptions para _tratamento de erro_, isso permite estender e entender o que realmente está acontecendo. Existem certos momentos que o fluxo é mais indicado, Exception deve ser usado para indicar um erro no programa.

No código abaixo provalemente o erro estaria na chamada por permitir _name_ nulo, mas o fato é que o método retorna _false_ e na verdade deveria ser uma _Argument Exception_.

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
<h2 id="4">#4 Evite parâmetros boleanos</h2>

\
Evite parâmetros boleanos, Você pode ter sobrecarga de métodos para este fim, ou usar até mesmo interfaces para mudar comportamento de métodos, mas usar parametros boleanos é uma péssima idéia, nunca se sabe o que de fato o parâmetro foi criado,
veja no exmeplo: O que o parâmetro faz? 

Se você se depara com o código abaixo para analisar, o que o segundo parâmetro faz? Fecha a conexão? Fecha o arquivo? 

```cs
   storage.Write(data, false);
```
Só vai saber se ir até o método!

```cs
   public void Write(string file, bool flush)
   {
       // ...
       
   }

```

Você poderia criar métodos para isso, veja os modificadores de acesso!

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


<h2 id="5">#5 Evite muitos parâmetros</h2> 

\
Muitos paramentos no métodos fazem perguntar qual a relação entre os parâmetros? Gosto de ver até 3 parâmetros, 4 em casos extremamentes específicos. (use uma classe no parametro!)

Evite:
```cs
   public void Login(string username, string password, bool persist, string ipAddress, IUser user, IUserServices services)
   {
       // ... 
       
   }
```

O que poderia ser feito:

 
```cs
   public void Login(ILoginUser user)
   {
       // ... 
       
   }
```


<h2 id="6">#6 Warning como erros</h2>    
_Aqui só vai funcionar para Visual Studio._


Configure seu BUILD para ver warning como erros. Lembre-se que Warnings vão deixar seu código sujo e difícil de manter e testar!


<h2 id="7">#7 Encapsulate Expressões Complexas:</h2>

Se você tem uma expressão complexa verifique se ela não pode se tornar um Método dentro da Classe!

Evite:
```cs
  
   if(login.Try > totalAllow && !login.IsVip && login.DueDate > CurrentDate)
   {
     // ..
   }
```
   
O que poderia ser feito:
```cs

   if(login.IsAllowToAccess)
   {
     // ..
   }
```
 

<h2 id="8">#8 Tente evitar multiplas saídas diretas</h2> 

Em métodos boleanos tente evitar muitas saida de forma direta.

Evite:
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

É melhor criar uma varável para isso

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

<h2 id="9">#9 Mantenha seu métodos pequenos</h2>

Dev, isso é primordial, mantenha seus métodos pequenos! se precisar crie outro métodos com nomes **bem sugestivos** para evitar também comentários! , mas métodos deveriam ser pequenos o máximo que possível.


<h2 id="10">#10 Mantenha suas classes pequenas</h2>

Outra parada importante! mantenha suas classes pequenas, Use abstract, interfaces, Delegates.. 
Claro que a pergunta aqui é **"O quanto é pequeno?"** 

Pequeno o bastante para que alguém possa entender facilmente! simples assim.



<h2 id="11">#11 Prefira Interfaces a Classes Abstract</h2>


Eu sei que vai depender do contexto, o que eu quero dizer aqui é ao fato que muitos developers abusam tanto de classes abstratas que o código fica ilegível além de pouco funcional, lembra que o C# não aceita multiplos heranças de classes né?


\
# Conclusão

Construir aplicações não significa apenas focar no objetivo final, mas sim em preocupar-se com o código e como ele será mantido, acredite!

E ai faz **sentido** para você ?

Cansei de pegar projeto ou re-escrever projetos por conta de má criação de código, eu sei por que eu já fui assim!

Vamos praticar o bem dentro dos código, beleza?

