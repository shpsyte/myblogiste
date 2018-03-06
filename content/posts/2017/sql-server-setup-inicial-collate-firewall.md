---
title: SQL Server – Cuidados na Instalação, Collate & Firewall
date: 2017-12-22T10:15:01+02:00
categories: ["Sql-Server"]
tags: ["sql-server","instalação sql"]

language: en
slug: sql-server-cuidados-collate-firewall
author:
  given_name: José luiz
  image: /images/teste.png
  smallcontent: Olá amigos, neste post vou falar sobre o Setup Inicial da Instalação do Sql Server, melhor collate, e regras do firewall para acesso via Rede/Externo. 
draft: false
---

 {{< youtube A8C5ofFp68I >}}
### Obs
Você deve primeiro escolher a versão do SQL SERVER que irá trabalhar em seus projetos, neste post estou usando a versão 2014 EXPRESS EDITION, mas é compatível com versões anteriores como 2005, 2008 e 2012.

A escolha da versão varia de acordo com seu projeto e é importante que você dimensione seu banco de acordo com seu projeto.

 
Geralmente as **instalações da Microsoft se resumem em Avançar, Avançar e Finalizar**, mas devemos ficar atentos as definições padrões, pois algumas destas configurações podem afetar todo o ciclo do projeto e é isso que iremos abordar neste POST.

 

Suponho que você já deve ter baixado o ***SQL SERVER***, e sem mais delongas vamos as dicas para garantir um ambiente seguro, prático e escalável.

<br>
#### **Inicie normalmente a instalação, mas fique atente as opções abaixo**
![Alt text](/images/inicio.png "Tela Inicial" )




### 1. SERVICES ACCOUNTS

Mantenha a conta **NT AUTHORITY** apenas para o SQL Engine e Browser, é uma conta interna com muitas permissões, mas não adote esta conta para o serviço SQL AGENTE, prefira a conta local services, mas como nossa versão é EXPRESS ela não dá suporte a este serviço. 🙁
![Alt text](/images/passwords.png "Tela Inicial" )

 
 
### 2. SQL SERVER COLLATION

Definir o Collate não é algo trivial, e para tornar esse conceito um pouco simples, prefiro referenciar que collation é a forma como serão armazenados comparados e ordenados os textos dentro do banco, em outras palavras esta opção irá definir se as letras **“A”, “a”, “Á”, “á”, “À”, “à”, “Ã” e “ã”** são equivalentes.

Vamos pensar na usabilidade do usuário e do programador, se a palavra “João” é diferente da palavra “joão” isso fará com que o programador efetue a transformação para pesquisa, causando gargalos, atrasos e como garantiremos que todos irão seguir este padrão, não é mesmo ?

```
    SELECT * 
      FROM Customer  
     WHERE UPPERCASE(Firstname) like ('%JOÃO%')
```

Para evitar que o programador se preocupe com o UPPERCASE ou LOWERCASE, TODOS meus projetos eu crio como padrão **SQL_Latin1_General_CP1_CI_AS** e aconselho a você usar este collate, se está com dúvida de qual usar.

Este collate não faz diferença entre MAIÚSCULA e MINÚSCULA, mas faz a distinção de Acentuação, a mesma instrução SQL acima agora ficaria assim.

```
    SELECT * 
      FROM Customer  
     WHERE Firstname like ('%João%')
```

Embora o COLLATE é fruto de outro POST dedicado, e sim, eu faço distinção de acentuação, vamos continuar com o propósito do POST   🙂
<br>
![Alt text](/images/collation.png "Tela Inicial" )



### 3. Definição da pasta de dados dos bancos;

Durante a instalação o SQL sugere a pasta padrão para os arquivos do Banco, **na minha opinião**, você deve mudar esta pasta por **SEGURANÇA.**

São 2(dois) arquivos **MDF e LDF**, Como o foco deste POST é para iniciantes, basicamente **MDF** contém toda a estrutura do banco, como linhas, colunas e dados, já o arquivo LDF contém os logs, ou seja, toda a atividade que ocorre dentro do **MDF.**

Eu alterei a instalação conforme abaixo, além disso prefiro deixar o **MDF separado do LDF.**
Além disso é recomendando também que em estruturas mais complexas as pastas de tempDB e Backup 
também sejam distintas.
<br>
![Alt text](/images/server-directoreis.png "Caminho das pastas" )



 
### 4. Liberando acesso do Sql Server via Rede

Existem ao menos duas maneiras de efetuar esta liberação, devemos pensar na estrutura atual e futura do nosso servidor. Esta é uma questão MUITO IMPORTANTE para a segurança da informação.

Tenha em foco que:

* A porta padrão é 1433 TCP ou 1434 UDP, mas não precisa liberar as duas portas!
* Mudar a porta é boa opção, mas não garante um segurança efetiva

##### 4.1 – Liberando acesso para uma única instância


* Se você tem apenas 1(uma) instância, considere esta opção, e altere a porta padrão para outra qualquer.

#### Step 1: **Inicie** o *SQL SERVER CONFIGURATION MANAGER*
 *iniciar>Microsoft SQL Server XXX>Ferramentas de Configuração>SQL SERVER CONFIGURATION MANAGER*
 <br>
![Alt text](/images/sqlconfmanager.png "Configure Manager" )
 
<br>

#### Step 2: **Habilite** o protocolo TCP
<p>Habilite o protocolo TCP/IP na opção SQL SERVER NETWORK CONFIGURATION</p>
![Alt text](/images/tcpipenable.png "Tcp Enable")
<br>

#### Step 3: **Altere** a porta do SQL
<p>Altere a porta desejada, nas propriedades IP ADRESSSES deste protocolo, na opção IPAll, o padrão é 1433 e limpe a caixa com a opção TCP Dynamic PORT</p> 
![Alt text](/images/propertiestcp.png "Propriedades TCP")
<br>  


#### Step 4: **Abra o Firewall** do Servidor 
<p>Abra o firewaal e adicione em regra INBOUND(ENTRADA) colocando  como regra a mesma porta (1433) (ou a que você escolheu) como TCP, finalize adicionando um nome apropriado para esta regra</p>
![Alt text](/images/setp3.png "Porta SQL")
<br>

 

#### Step 5: **Efetue um teste** de conexão
<p>Efetue um teste, mas não envie o nome da instância</p>
![Alt text](/images/teste.png "Porta SQL")
<br>

**Com isso já é possível acesso**, caso não seja possível revise se as portas liberadas são as mesmas.

É isso, espero que tenham gostado, até a próxima!
:smile:
