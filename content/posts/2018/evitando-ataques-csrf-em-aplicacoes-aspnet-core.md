---
title: "Evitando ataques CSRF em aplicações ASP.NET Core"
date: 2018-07-13T14:39:43-03:00
categories: ["cSharp", ".Net Core"]
tags: ["ASP.NET Core", "Segurança", "CSRF"]
language: pt-br
slug: evitando-ataques-csrf-em-aplicacoes-aspnet-core
image: https://i.imgur.com/iPhXpVq.png
author: José luiz
keyword: "ASP.NET Core, CSRF, Segurança"
excerpt: Quer deixar suas aplicações .Net Core (e MVC) seguras contra ataques CSRF? Vamos descobrir juntos neste post como podemos nos proteger desta vulnerabilidade. 
draft: false
---

{{< youtube w9ORoCHr_gw >}} 

<br>

Olá, você quer deixar suas aplicações .Net Core e MVC mais seguras e previnir contra ataques CSRF ? Vamos descobrir juntos neste post como podemos proteger nossas aplicações contra esta vulnerabilidade, com testes práticos e visíveis.

Antes de mais nada: O **CSRF ou XSRF** (do inglês Cross-site Request Forgery - Falsificação de solicitação entre sites) é um tipo de ataque malicioso a um website/webapp no qual comandos não autorizados (como alteração de senha, usuarios, registros) são enviados para o servidor usando o browser em que o website/webapp confia.

<br>
#### Gravidade

De acordo com o Departamento Americano de Segurança Nacional o CSRF é a vulnerabilidade mais perigosa classificada em 909° nos bugs de software mais perigosos já encontrados, tornando esta vulnerabilidade **mais perigosa** do que a maioria dos buffer overflows, para mais detalhes sobre este tipo de ataque, veja <a href="https://pt.wikipedia.org/wiki/Cross-site_request_forgery" target="_blank">aqui</a>

#### Usar certificado HTTPS não impede este tipo de ataque!

<br>
#### Caso prático para entender
Ok, vamos para um caso bem prático para você entender o problema. 

Quando o usuário efetua login em nosso sistema, o browser armazena os cookies de autenticação, então o ataque usa este cookie como **a confiança** que sistema precisa para executar comandos. E deixar o cookie com expiração rápida não é a melhor estratégia.

Então imagina que o seu usuário recebeu um email assim:


:heart_eyes:

> <span class="text-success">Parabéns! você ganhou um prêmio incrível! </span> 
> <br>Clique <span class="text-primary">aqui</span> para retirar seu prêmio...

:smiling_imp: Tá bom , Tá bom, eu sei que forçei a barra, (mas tem gente que clica einh...)

Mas imagine um email com o contexto da empresa

> <span class="text-success">Não consegui abrir o pedido, pode verificar para mim ? </span> 
> <br> <span class="text-primary">abrir pedido</span>

Se este usuário estiver logado do sistema, e se não estiver preparado para este ataque, o código abaixo será executado!

```HTML
<form  method="post" action="http://webapp.com/users/edit">
    <input type="hidden" name="Email" value="admin@admin.com" />
    <input type="hidden" name="Senha" value="NovaSenha" />
    <input type="submit" value="abrir pedido"/>
</form>
```
 
 Qual código ? o sistema vai alterar a senha do usuário admin@amdin.com para a nova senha.

<Br>
#### A Resolução
Se você usa o ASP.NET Core, ou ASP.NET MVC a solução é muito simples, basta você adicionar a modificador 
**[ValidateAntiForgeryToken]** na assinatura do seu método.

```csharp
[HttpPost]
[ValidateAntiForgeryToken]
public ActionResult Edit(int id)
{
    /// seu codigo
    return View();
}

```
E no seu fomulário
```HTML
<form  method="post" action="Edit">
     @Html.AntiForgeryToken()
    
</form>
```

> **Se usar o aps.net Core 2.0 ou superior** o FormTagHelper injeta antiforgery tokens em formulários HTML elementos de formulário HTML. Se você quiser desabilitar pode usar o comnado asp-antiforgery="false" no corpo do formulário.


Em cada um dos casos anteriores, o ASP.NET Core adiciona um campo de formulário oculto semelhante à: 

```HTML
<form  asp-action="Edit" method="post" >
     <input name="__RequestVerificationToken" type="hidden" value="CfDJ8NrAkS ... s2-m9Yw">
</form>
```

Você pode adicionar o modificador **[ValidateAntiForgeryToken]** a nível de controller, assim todos os métodos
abaixo herdarão, não se preocupe métodos GET não usarão este modificador.

```csharp
    [ValidateAntiForgeryToken]
    public class HomeController : Controller
    {

       ...metodos
    } 
```


Se usa ASP.NET Core, é possível alterar o arquivo ***Startup.cs*** e deixar a validação de forma global, prevenindo assim que desenvolvedores esqueçam de usar este atributo.

```csharp
public void ConfigureServices
{
   ....
   services.AddMvc(options => options.Filters.Add(new AutoValidateAntiforgeryTokenAttribute()));
}
```

> Você pode usar o modificador  **[IgnoreAntiforgeryToken]** para eliminar a necessidade de um token de antiforgery para uma determinada action (ou controller).


<br>
#### Dica EXTRA!!!!
Ai você me pergunta ?
E aquele action, que é um arquivo javascript que chama passando como parametro um JSON ? como faremos ?

O ASP.NET Core nos fornece um método **IAntiforgery** que tem uma API para poder usar este recurso, então em nosso CSHMTL, usaremos assim:

```csharp
@inject Microsoft.AspNetCore.Antiforgery.IAntiforgery Xsrf
@functions{
    public string GetAntiXsrfRequestToken()
    {
        return Xsrf.GetAndStoreTokens(Context).RequestToken;
    }
}
```
E no HTML
```html
<input type="hidden" id="RequestVerificationToken" 
       name="RequestVerificationToken" value="@GetAntiXsrfRequestToken()">
```

Então em nosso javascript, podemos usar assim:

```javascript
    var token = document.GetElementById("RequestVerificationToken").value;
    $.ajax({
        type: "POST",
        headers:
        {
            "RequestVerificationToken": token
        },
        url:   { url },
        data: { parametros }  
          ...
        },
        dataType: "json"
    });
```

<br>
### Resumindo
Proteger nosso sistema contra ataques **CSRF** é muito importante, mas não a única solução, existem muitos outros ataques que devemos nos preocupar. 

É isso, até a próxima semana... :) 