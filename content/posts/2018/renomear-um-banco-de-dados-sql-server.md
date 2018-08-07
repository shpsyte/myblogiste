---
title: "Renomear um banco de dados SQL SERVER"
date: 2018-08-06T20:25:32-03:00
categories: ["Sql-Server"]
tags: ["Sql-Server","Renomear banco de dados"]
language: pt-br
slug: renomear-um-banco-de-dados-sql-server
author: José Luiz
image: https://i.imgur.com/QFWmhnW.png
keyword: "SQL Server"
excerpt: Olá, já precisou renomear um banco de dados do sql server ? Vamos dar uma olhada pequeno post que criei para complementar o post anterior...
draft: false  
---

<!-- {{< youtube VB-WXFEapBk >}} -->
<img src="https://i.imgur.com/QFWmhnW.png" class="img-fluid" alt="Rename DATABASE">

#### Renomear Banco de dados 
Olá, já precisou renomear um banco de dados do sql server ? Vamos dar uma olhada pequeno post que criei para complementar o post anterior onde falei sobre mover os arquivos de local.

Este tópico aplica-se a versões do **SQL Server local**, e **SQL Azure**, enjoy.

#### Antes de começar!
Antes de começar, você já fez o backup ?, é uma boa prática, lembre-se disso. Alias manter uma politica de recuperação é ALTAMENTE recomendável, então...

Bom, resolvi escrever este post pequeno, como uma forma de complementar o post anterior, onde eu falei sobre mover os arquivos do banco de local, e como no mesmo problema anterior as instalções antigas não tinham um padrão de nome, ***vai saber né...***.

Bom o comando é bastante simples, vamos a prática.

#### Comandos
1. Conecte-se ao Mecanismo de Banco de Dados.

2. Inicie uma Nova Consulta.

3. Execute o comando abaixo:

```sql
USE master;  
GO  
ALTER DATABASE seu_banco_atual  
Modify Name = novo_nome ;  
GO  
```

Simples não ? 

##### IMPORTANTE:
>Você não pode mudar o banco de dados do sistema (Master, Model, ...)
>O Nome lógico do banco não vai ser alterada...


Ok, sabemos alterar o nome do banco, mas se fizermos uma pesquisa com o comando abaixo, veremos que o nome dos arquivos lógicos não foram alterados :

```sql
SELECT name, physical_name AS CurrentLocation, state_desc  
FROM sys.master_files  
WHERE database_id = DB_ID(N'novo_nome');  
```

<Br>
#### É isso ai !
Em certos casos queremos manter o padrão de banco, assim como nossa empresa, e se você tem um banco fora do padrão, poderá usar este comando.
 
 
 Mas fique atento, que a sua connection string também deverá ser alterada..


Espero que eu possa lhe ajudar neste nova jornada!

Até mais...

:)
