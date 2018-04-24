---
title: Recuperar DB SQL com MDF sem o LDF
date: 2017-11-25T10:15:01+02:00
categories: ["Sql-Server"]
tags: ["sql-server","backup sql"]
language: pt-br
slug: recuperar-banco-sql-server-somente-com-mdf-ldf
author: José luiz
keyword: "Recuperar Banco SQL, Recovery"
excerpt: Olá amigos, neste vídeo, vou falar sobre o Como recuperar um banco de Dados SQL SERVER somente com o arquivo MDF sem o LDF, além de mostrar tudo em vídeo para um melhor entendimento.
draft: false
---

 {{< youtube ukJ5nrRzNa0 >}}

### Obs
Estou usando a versão SQL **SERVER EXPRESS 2014** mas é compatível com versões anteriores como 2005, 2008 e 2012. Lembre-se que manter uma **política de BACKUP é extremamente necessário**, em outro post vou falar tudo o que precisa saber sobre planos de recuperação, mas hoje vamos focar em recuperar o banco ok ?

Recuperar um arquivo MDF pode ocorrer em diversos casos, você pode solicitar o arquivo para análise de algum erro, “alguém” apagou o LDF (com a base offline), ou LDF ficou corrompido por **falta de energia.** 🙁  São vários os cenários.

#### Aqui iremos realizar 2 procedimentos simples para Atachar o arquivo

**AMBOS SEM O ARQUIVO LDF.**

#### 1 – Comando

```sql
    EXEC sp_attach_single_file_db @dbname= dbTest,
      @physname=N'F:\DbSQL\Data\dbTest.mdf'
```


#### 2 – Comando

```sql
    CREATE DATABASE [dbTest] ON 
    ( FILENAME = N'F:\DbSQL\Data\dbTest.mdf' )
     FOR ATTACH_REBUILD_LOG
```


Estes simples comando irão recriar o arquivo de LOG, caso ele não exista.

*File activation failure. The physical file name “dbTest_log.ldf” may be incorrect.
New log file ‘F:\DbSQL\Log\dbTest_log.ldf’ was created.*

**Você pode usar o SQL SERVER Management Studio para fazer também.**

#### Dica Rápida!

MDF: Contém a estrutura do banco como tabelas, linhas e colunas além dos DADOS é claro

LDF: Contém o LOG de transição, tudo que acontece dentro do MDF é registrado aqui, mas os dados das tabelas estão efetivamente no arquivo MDF.

No SQL SERVER 2008 R2, SQL SERVER 2014, mesmo com o banco em read_only foi possível usar apenas os comandos acima, porém se o banco estiver em modo read_only pode aparecer o seguinte erro:

>“Log file ‘dbTest_log.ldf’ does not match the primary file.  It may be from a different database or the log may have been rebuilt previously.The log cannot be rebuilt when the primary file is read-only.” 

**Se isso acontecer, calma ainda podemos tentar recuperar.**

(veja que o plano de backup neste ponto é mais indicado!)

##### 1. Crie um banco de dados “falso” com o mesmo nome do original, incluse no mesmo caminho original.

```sql
CREATE DATABASE [dbTest]
     CONTAINMENT = NONE
     ON PRIMARY 
    ( NAME = N'dbTest', FILENAME = N'F:\DbSQL\Data\dbTest.mdf' , SIZE = 3072KB , FILEGROWTH = 1024KB )
     LOG ON 
    ( NAME = N'dbTest_log', FILENAME = N'F:\DbSQL\Log\dbTest_log.ldf' , SIZE = 1024KB , FILEGROWTH = 10%)
GO
```

##### 2. Colocar o banco em read_only e offline

```sql
    alter database dbTest set read_only
    alter database dbTest set offline
```

##### 3. Substituir o arquivo MDF “falso” pelo original.

##### 4. Colocar o status do banco para emergency e single_user

```sql
    alter database dbTest set emergency
    alter database dbTest set single_user
```

##### 5. Excluir o arquivo de Log do banco “falso”;

##### 6. Recriar o LOG banco.

```sql
    alter database dbTest rebuild log on
    (Name= dbTest_log,filename='F:\DbSQL\Log\dbTest_log.ldf')
``` 

##### 7. Apontar o status para online:

```sql
    alter database dbTest set online
```

##### 8. Mudar o status do banco para multi_user:

```sql
    alter database dbTest set MULTI_USER
```    

 

Felizmente conseguimos restaurar a base, (embora não tenhamos mais os LOG’s de transação), lembre-se que em ambientes de produção é recomendado que existam outros tipos de recoverys como backup.

### É isso, até a próxima