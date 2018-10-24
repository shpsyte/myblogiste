---
title: "Como evitar ataques de redirecionamento em ASP.NET Core"
date: 2018-07-17T06:30:06-03:00
categories: ["cSharp", ".Net Core"]
tags: ["ASP.NET Core", "Segurança", "Redirecionameto"]
language: pt-br
slug: como-evitar-ataques-de-redirecionamento-em-aspnet-core
image: https://i.imgur.com/5pIRddV.png
author: José luiz
keyword: "ASP.NET Core, Redirecionamento, Segurança"
excerpt: Neste post sobre segurança em .Net Core, vamos falar sobre o ataque de redirecionamento de URL, também muito comum a sistemas, vamos usar uma técnica simples para evitá-la.  
draft: false
---

{{< youtube 7vMylg7FhaQ >}}

<br>

Olá, tudo bem ? Neste post sobre segurança em .Net Core, vamos falar sobre o ataque de redirecionamento ab erto, também muito comum a sistemas, vamos usar uma técnica ***simples*** para evitá-la.

Antes de mais nada: O **Redirecionamento Aberto** (do inglês open redirect) É um técnica que consiste em "enganar o usuário" afim  de ele nos fornecer suas credenciais baseado em uma página web clonada.

Quando você acessa algum recurso no sistema que é protegido por autenticação, o sistema redireciona para a página de login, e após você informar seus dados de acesso o sistema redireciona novamente para a página de solicitada. É nesta confiança que este ataque se basea...

<br>
#### Gravidade
Bom, qualquer técnica de ataque aos nossos sistemas devem ser caracterizados como grave, não queremos nenhum invasor não é mesmo ? mas este tipo de ataque é gravíssimo pois podem expor informações sensíveis ao público e pior, pode demorar muito para percebermos a falha

<br>
#### Caso prático para entender
Imagine que um usuário mal-intencionado cria uma página igual a página de login do seu sistema, para poder guardar as informações de login, e então ele monta um link e convence o usuário a clicar nele.

```html
http://seusistema.com/protected/logon?returnurl=http://sistemahacker.com/protected/logon
```

***Note que a url é do seu sistema*** mas ele redireciona para outro link!

1. O usuário faz logon com êxito.
2. O usuário é redirecionado (pelo site) para www.sistemahacker.com/protected/logon (site mal-intencionado que se parece com um site real).
3. O usuário fizer logon novamente (fornecendo ao site suas credenciais do site) e é redirecionado para o site real.

O usuário provavelmente vai achar sua primeira tentativa de logon falha, e sua segunda foi bem-sucedida e **não irá perceber** que as suas credenciais foram comprometidas. 

Se você tem um redirecionamento aberto em sua aplicação, ela pode ser usada por este tipo de ataque, você já ouviu falar em <a href="https://pt.wikipedia.org/wiki/Phishing" target="_blank"> Phishing  </a> ? 

<br>
#### A Resolução
Tenha em mente que: Ao desenvolver aplicativos, trate **todos os dados fornecidos pelo usuário como não confiável.**

1. Use o **LocalRedirect** que lançará uma exceção se uma **URL** local não for especificada. Caso contrário, ele se comporta exatamente como o Redirect.

```csharp
public IActionResult Action(string redirectUrl)
{
    return LocalRedirect(redirectUrl);
}
```

2. Use o **IsLocalUrl** que impede que os usuários seja redirecionado para um site externo. Use este método para testar as URLs antes de redirecionar:


```csharp
private IActionResult RedirectToLocal(string returnUrl)
{
    if (Url.IsLocalUrl(returnUrl))
    {
        return Redirect(returnUrl);
    }
    else
    {
        return RedirectToAction(nameof(HomeController.Index), "Home");
    }
}
``` 


<br>
### Antes de partir
* Registre os detalhes da URL que foi fornecida para redirecionamento externo, o log pode ajudar no diagnóstico de ataques de redirecionamento.
* Use autenticação de dois fatores sempre que posível.
* Se seu aplicativo redireciona o usuário com base no conteúdo da URL, certifique-se de que os redirecionamentos só são feitos localmente e não qualquer URL que pode ser fornecido na querystring.


<br>
### Resumindo
Proteger nosso sistema contra qualquer ataque é muito importante, tenha em mente que usuário mal-intencionado sempre estão em busca de novas técnicas, e cabe a você também aprimorar a segurança do seu sistema e da informação. 

É isso, até a próxima semana... :) 
