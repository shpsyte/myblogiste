---
title: "Guia para desenvolvedores aprenderem a usar o localdb em seus desenvolvimentos"
date: 2018-04-26T08:15:39-03:00
categories: ["Sql-Server"]
tags: ["sql-server","localDB", "desenvolvimento-rápido"]
language: pt-br
slug: guia-para-desenvolvedores-aprenderem-a-usar-o-localdb
author: José Luiz
image: https://i.imgur.com/ATGZCrY.png
keyword: "Sql Server, LocalDB, MS SQL Express"
excerpt: Olá, você conheçe o LocalDB? Não ? É um recurso incrível do SQL SERVER Express voltado para desenvolvedores de softwares, e se você não conheçe tenho certeza que depois deste post, você vai começar a usar este recurso fantástico para sua programação...
draft: false
---

<!-- {{< youtube cN9p97NVtUg >}}  -->
<img src="https://i.imgur.com/ATGZCrY.png" class="img-fluid" alt="">
<br>
#### Guia para desenvolvedores aprenderem a usar o localdb em seus desenvolvimentos
Olá, você conhece o **LocalDB** ? Não ? Então acompanhe este **post até o final** que eu tenho certeza que você vai começar a usar este recurso incrível para sua programação de softwares e aplicativos.

<br>
#### Afinal o que é **localdb**  ?

É um recurso do ***SQL SERVER Express*** destinado principalmente aos desenvolvedores e trata-se de um conjunto mínimo de arquivos necessários para fornecer a eles um **Mecanismo de Banco de Dados do SQL Server** que permite que gravem e testem o código *Transact-SQL* sem precisar gerenciar uma ***instância de servidor inteira do SQL Server*** o que consome muitos recurso desnecessário da sua máquina.

O LocalDB é *muito fácil de instalar e configurar* e existem dois métodos de instalação:

* Usar o arquivo único **SqlLocalDB.msi**
* Usar a **opção no momento da instalação** do SQL Server (Versão 2012 ou mais recente)

Em ambos métodos o processo será praticamente o mesmo, e o resultado **será extamente o mesmo**, então vou mostrar a instalação usando o arquivo ***msi***, já que o segundo método vai apenas baixar o mesmo arquivo e executar em seu computador.




#### 1. Fazendo o Download do Arquivo
Você pode fazer o download do arquivo usando este <a href="https://www.microsoft.com/en-US/download/details.aspx?id=42299" target="_blank">   Sql Server 2014 Express </a> e escolha a versão correta da sua plataforma (32 ou 64 bits), note o tamanho do arquivo, muito pequeno.

<img src="https://i.imgur.com/vh1kpV6.png"  class="img-fluid" alt="Download arquivo MSI do localBD" text="Download arquivo MSI do localBD" >

#### 2. Instalando o arquivo MSI
<br>
O processo de instalação do SqlLocalDB.MSI é muito ***rápido e fácil.*** Quando um usuário clica duas vezes no arquivo de instalação, a janela do **Microsoft SQL Server 2014 Express LocalDB** aparecerá; e então clique no botão *avançar* para continuar:

<img src="https://i.imgur.com/FpA2CuP.png" class="img-fluid" alt="Instalação localBD" text="Instalação localBD">

<br>
Na janela Contrato de Licença, leia com atenção os **termos de uso da licença** e marque a opção *Aceito os termos do contrato de licença*, se concordar é claro e novamente, clique no botão *continuar*:

<img src="https://i.imgur.com/v0fPsF9.png" class="img-fluid" alt="Contrato de licença" text="Contrato de licença">
<br>

O passo seguinte é clicar no botão **Instalação:**

<img src="https://i.imgur.com/HxZDfXh.png" class="img-fluid" alt="Progresso da Instalação" text="Progresso da Instalação">
<br>

Após alguns segundos, o processo de instalação será concluído:

<img src="https://i.imgur.com/MQME4tX.png" class="img-fluid" alt="Fim da Instalação do localDB" text="Fim da Instalação do localDB">


O processo de instalação é o mesmo para o **Microsoft SQL Server 2016 & 2017 Express LocalDB**. Apenas o processo de download é um pouco diferente. 

Por padrão, o **Microsoft SQL Server 2014 Express LocalDB** com todas as DLLs necessárias está localizado em <br>
```msdos
  .\Arquivos de Programas\Microsoft SQL Server\120\LocalDB\Binn
```

#### 3. Usando o utilitário *sqllocaldb*
<br>
Depois que o programa é instalado, a instância padrão (automática) do LocalDB pode ser iniciada, ou se preferir pode criar e usar **sua própria instância** do LocalDB usando o utilitário 
<a href="https://docs.microsoft.com/en-us/sql/tools/sqllocaldb-utility?view=sql-server-2017" target="_blank">
**SqlLocalDb**</a> (FANTÁSTICO).

<br>
Para ver todas as instâncias do LocalDB, na janela *Prompt de Comando*, digite o seguinte comando: **sqllocaldb info**

<img src="https://i.imgur.com/KhweRcB.png" class="img-fluid" alt="SqlLocaldb info" text="SqlLocaldb info">

<br>
Para criar uma nova instância basta digitar o comando: **sqllocaldb create minhainstancia**

<img src="https://i.imgur.com/JznZOeW.png" class="img-fluid" alt="SqlLocaldb create" text="SqlLocaldb create">

O utilitário <a href="https://docs.microsoft.com/en-us/sql/tools/sqllocaldb-utility?view=sql-server-2017" target="_blank"> **SqlLocalDb**</a> permite gerenciar as instâncias, compartilhar acesso, parar serviços, etc..
vale a pena ler sua documentação sobre ele no link acima.

#### 4. Um pouco mais do localdb
<br>
Realmente o **LocalDB** é fantástico para programação, e eu uso amplamente para desenvolver meus aplicativos em .Net MVC, além não consumir grandes recursos da nossa máquina. Existe alguns recursos dele que tenho que mencionar:

1. Suporta o compartilhamento de instâncias.
2. Diferentes usuários do computador podem criar as instâncias com o mesmo nome.
3. O LocalDB tem seu collection como ***SQL_Latin1_General_CP1_CI_AS*** e não pode ser alterada. 
4. Collection de nível de banco de dados, coluna e expressão são suportadas normalmente. 
5. Suporta instalação silenciosa. 
6. Possui a mesma extensão *.MDF*
7. Você pode anexar arquivos MDF da versão Express

Já comentei sobre collection, neste <a href="http://www.joseluiz.net/sql-server-cuidados-collate-firewall/" target="_blank"> post. </a>

#### 5. Conectando a uma instância do localdb
<br>
Ok, já instalamos mas como fazemos para se conectar a uma instância do **SQL localDB** ?

Existem dois métodos para a conexão do LocalDB:

* Usando o *nome do pipe* da instância 
* Usando o  (LocalDB)\ + *nome da instância* 

Para descobrir o *pipe* da instância basta digitar o comando, na *janela do prompt* : 

<img src="https://i.imgur.com/JN3uFjI.png" class="img-fluid" alt="SqlLocaldb pipe" text="SqlLocaldb pipe">

Com estas informações em mãos (*pipe ou nome da instância*), basta digitar o endereço em nosso campo 
*Nome do Servidor* em nossa ferramenta, que pode ser Visual Studio, SQL Server Management Studio, 
**Sql Operations Studio** ou em nossa string de conexão

<small>Não conheçe o SQL OPERATION STUDIO , clique <a href="https://docs.microsoft.com/pt-br/sql/sql-operations-studio/download?view=sql-server-2017" target="_blank">aqui</a> e surpreenda-se com este gerenciador de Banco SQL SERVER incrível </small>

##### 5.1 - Pelo pipe name
<img src="https://i.imgur.com/Ytx97pr.png" class="img-fluid" alt="SqlLocaldb pipe" text="SqlLocaldb pipe">

##### 5.2 - Pela instância 
<img src="https://i.imgur.com/Fh49HEP.png" class="img-fluid" alt="SqlLocaldb instance" text="SqlLocaldb instance">

##### 5.3 - Via string de conexão
```xml
<add name="ConnectionStringName"
    providerName="System.Data.SqlClient"
    connectionString="Data Source=(LocalDb)\MSSQLLocalDB;Initial Catalog=dbTeste;Integrated Security=SSPI;AttachDBFilename=|DataDirectory|\dbTeste.mdf" />

```

<br>
Basta então trabalharmos em nosso projeto...

<img src="https://i.imgur.com/L0cBEYb.png" class="img-fluid" alt="SqlLocaldb Conectado" text="SqlLocaldb Conectado">


<br>
#### 6. Resumindo
**LocalDB** é um recurso incrível para usarmos em nosso dia-a-dia de desenvolvedor, além de não usar recursos computacionais, como uma instância completa do SQL faria, é uma versão muito rápida e fácil de instalar, trabalhar e ainda possui todos os recursos necessários para você desenvovler seu software. 

É isso, abraços e até a próxima...

