---
title: 3 Dicas para Documentar Banco SQL SERVER.
date: 2018-02-22T10:15:01+02:00
categories: ["Sql-Server"]
tags: ["sql-server","documentação sql "]
language: pt-br
slug: 3-dicas-para-documentar-banco-sql-server
image: https://i.imgur.com/BLjOjtr.png
author: José luiz
keyword: "Documentar Banco SQL Server"
excerpt: Ao longo destes anos de desenvolvimento, encontrei banco de dados que não possuem padronização e nem documentação adequada, e com o passar do tempo isto se torna um problema para todos.
draft: false
---

 <!-- {{< youtube BScNAF-iOq8 >}} -->
 <img src="https://i.imgur.com/BLjOjtr.png" class="img-fluid" alt="Rename DATABASE">

### Obs


Ao longo destes **anos de desenvolvimento**, encontrei banco de dados que não possuem padronização e nem **documentação adequada,** e com o passar do tempo isto se torna um problema para todos (e principalmente para empresa) que precisam manipular ou consultar seus dados.

Em muitos casos, somente é possível conhecer e interpretar a estrutura do banco de dados **com ajuda de um dos desenvolvedores original** ao seu projeto e isto torna todo o trabalho de manutenção e melhoria muito mais difícil e lento, consequentemente, mais caros, pois consomem muito mais recurso humano.

A documentação **é fundamental e deve ser considerada como requisito mínimo** para o bom andamento de um projeto de banco de dados. Vou apresentar 3 truques e comandos simples para tornar essa documentação um processo prático.


### Aviso

***Tudo o que vai ser descrito aqui é fruto pura e unicamente das minhas experiências profissionais. Desta forma, leia, use o que se sentir à vontade. Aceito sugestões de outras dicas, pode deixar nos comentários por favor.***

 
### 1. ADICIONE DESCRIÇÕES AS COLUNAS DAS TABELAS

Ao desenvolver um banco de dados, é uma **boa prática comentar o que a coluna trata** de uma determinada tabela, para que o programador não perca tempo ao entender o que aquela coluna faz, mesmo que a coluna seja óbvia. Então ao criar tabelas escreva explicitamente uma descrição a coluna.

Estou usando o SSMS, mas você pode adicionar também via SCRIPT

<img src="/images/DocColuna.png" alt="Adicionando descrição em colunas sql">

ou pelo script,

```sql
 EXECUTE sp_updateextendedproperty N'MS_Description', 
  N'TEXTO_A_SER_ADICIONADO', N'SCHEMA', N'dbo', N'TABLE', N'NOME_DA_TABELA', N'COLUMN', N'NOME_DA_COLUNA'
```


troque apenas os texto **NOME_DA_TABELA e NOME_DA_COLUNA**

A Sacada aqui é uma Stored Procedure que você pode usar a vontade, e enviar aos seus programadores chamada sp_desc, o fonte desta sp esta abaixo e basta você usar assim:

```sql
    sp_desc Customer
```

Onde “Customer” é nome da sua tabela, o resultado sai desta maneira:
<img src="/images/DocColunaDesc.png" alt="Resultado">



```sql
CREATE PROCEDURE sp_desc (
  @tableName  nvarchar(128)
)
AS
SET NOCOUNT ON
-- **************************************************************************************                                                                         
-- Data Criação   : 06/11/2012                Autor:  (José Luiz)
-- Obs: Use for DESCBRIBE A TABLE
-- **************************************************************************************                                                                         


BEGIN
  DECLARE @databaseName sysname;
  DECLARE @schemaName   sysname;
  DECLARE @objectName   sysname;
  DECLARE @objectID     int;
  DECLARE @tmpTableName varchar(100);
  DECLARE @sqlCmd       nvarchar(4000);

  SELECT @databaseName = PARSENAME(@tableName, 3);
  IF @databaseName IS NULL SELECT @databaseName = DB_NAME();

  SELECT @schemaName = PARSENAME(@tableName, 2);
  IF @schemaName IS NULL SELECT @schemaName = SCHEMA_NAME();

  SELECT TOP 1 @schemaName = TABLE_SCHEMA 
    FROM INFORMATION_SCHEMA.TABLES
   WHERE  TABLE_NAME= @tableName


  SELECT @objectName = PARSENAME(@tableName, 1);
  IF @objectName IS NULL
    BEGIN
      PRINT 'Object is missing from your function call!';
      RETURN;
    END;

  SELECT @objectID = OBJECT_ID(@databaseName + '.' + @schemaName + '.' + @objectName);
  IF @objectID IS NULL
    BEGIN
      PRINT 'Object [' + @databaseName + '].[' + @schemaName + '].[' + @objectName + '] does not exist!';
      RETURN;
    END;

  SELECT @tmpTableName = '#TEMP_DESCRIBE_' + CAST(@@SPID AS VARCHAR) + REPLACE(REPLACE(REPLACE(REPLACE(CAST(CONVERT(CHAR, GETDATE(), 121) AS VARCHAR), '-', ''), ' ', ''), ':', ''), '.', '');
  --PRINT @tmpTableName;
    
  SET @sqlCmd = '
    USE ' + @databaseName + '
    CREATE TABLE ' + @tmpTableName + ' (
      [Name]              nvarchar(128) NOT NULL
     ,[Type]              varchar(50)
     ,[CharSet]           varchar(50)
     ,[Collation]         varchar(50)
     ,[Nullable]          varchar(3)
     ,[Default]           nvarchar(4000)
     ,[Comments]          nvarchar(3750));

   INSERT INTO ' + @tmpTableName + '
    SELECT objname, NULL, NULL, NULL, NULL, NULL, Convert(NVARCHAR(3750),value )  
      FROM fn_listextendedproperty (NULL, ''schema'', ''' + @schemaName + ''', ''table'', default, NULL, NULL)
      WHERE objname = ''' + @objectName + ''';
      
    INSERT INTO ' + @tmpTableName + '
    SELECT
      a.[NAME]
     ,a.[TYPE]
     ,a.[CHARSET]
     ,a.[COLLATION]
     ,a.[NULLABLE]
     ,a.[DEFAULT]
     ,b.[COMMENTS]
    FROM
      (
        SELECT
          COLUMN_NAME                                     AS [NAME]
         ,CASE DATA_TYPE
            WHEN ''char''      THEN DATA_TYPE + ''('' + CAST(CHARACTER_MAXIMUM_LENGTH AS VARCHAR) + '')''
            WHEN ''numeric''   THEN DATA_TYPE + ''('' + CAST(NUMERIC_PRECISION AS VARCHAR) + '', '' + CAST(NUMERIC_SCALE AS VARCHAR) + '')''
            WHEN ''nvarchar''  THEN DATA_TYPE + ''('' + CAST(CHARACTER_MAXIMUM_LENGTH AS VARCHAR) + '')''
            WHEN ''varbinary'' THEN DATA_TYPE + ''('' + CAST(CHARACTER_MAXIMUM_LENGTH AS VARCHAR) + '')''
            WHEN ''varchar''   THEN DATA_TYPE + ''('' + CAST(CHARACTER_MAXIMUM_LENGTH AS VARCHAR) + '')''
            ELSE DATA_TYPE
          END                                             AS [TYPE]
         ,CHARACTER_SET_NAME                              AS [CHARSET]
         ,COLLATION_NAME                                  AS [COLLATION]
         ,IS_NULLABLE                                     AS [NULLABLE]
         ,COLUMN_DEFAULT                                  AS [DEFAULT]
         ,ORDINAL_POSITION
        FROM   
          INFORMATION_SCHEMA.COLUMNS
        WHERE   
          TABLE_NAME = ''' + @objectName + '''
      ) a
      FULL JOIN
      (
         SELECT
           CAST(value AS NVARCHAR(3750))                        AS [COMMENTS]
          ,CAST(objname AS NVARCHAR)                            AS [NAME]
         FROM
           ::fn_listextendedproperty (''MS_Description'', ''schema'', ''' + @schemaName + ''', ''table'', ''' + @objectName + ''', ''column'', default)
      ) b
      ON a.NAME COLLATE SQL_Latin1_General_CP1_CI_AS = b.NAME COLLATE SQL_Latin1_General_CP1_CI_AS
    ORDER BY
      a.[ORDINAL_POSITION];

    SELECT * FROM ' + @tmpTableName + ';'

   -- PRINT @sqlCmd;

    EXEC sp_executesql @sqlCmd;
    RETURN;
END;
GO
```

#### Sim, fiquei com ciúmes da oracle e dai. 🙂


### 2. GERAR DOCUMENTAÇÃO HTML INTEIRA DO BANCO

Esta sem dúvida é outra **DICA mega importante.** Trata-se de um aplicativo desenvolvido pelo Altair que está disponível no CodPlex (*Site que vai ficar OFF que irão migrar para outra plataforma e que por isso, deixei uma cópia para ser baixada por este site também*).

Trata-se do **DOC FOR Microsoft SQL Server** , nome oficial na página, para conferir da uma olha aqui, mas logo abaixo faço um overview da ferramenta.

Ela gera a documentação inteira do banco Microsoft SQL Server e mapeia a estrutura e informação das tabelas e combina tudo isso em 2 formatos de saída: (Sim eu sei que tem 3 formatos..)

* HTML – com link de tabelas e em formato de fácil leitura e impressão
* XML – XML file, que pode ser usado por outros processadores de arquivos para armazenar ou codificar

Vamos mostrar apenas a saída **HTML que é a que nos interessa neste POST**, a versão suportada é **SQL SERVER 2008** mas segundo o programador deve funcionar na versão 2005, e eu testei em versão 2016 e funciona perfeitamente.

##### Como usar

Muito simples.

1. Efetue o download e navegue pelo DOS até onde salvou o aplicativo 
<a href="https://sqldbdoc.codeplex.com/"> Source Original,</a> <a href="https://drive.google.com/file/d/138sk1VbbZ54ypUojVEYPno38AWXzJmOl/view"> Source Alternativo (por conta do Codplex sair) </a>
 
2. Chame o aplicativo passando a string de conexão e o nome do arquivo de saída com a extensão
```msdos
    sqldbdoc "SERVER =.\SqlExpress; TRUSTED_CONNECTION = yes; DATABASE = AdventureWorks" banco.html
```
3. Pronto! fácil não ?

A saída é ótima!

<img src="/images/docdb.png" class="img-fluid" alt="Resultado">



### 3 –  MANTENHA UM SCRIPT DE TODO O BANCO DE DADOS

Um banco de **dados completo salvo em um único arquivo de script SQL**, isso ajuda a reconstruir a mesma estrutura em outros ambientes computacionais ou até mesmo em outras plataformas de database, é um dica simples mas muito válida.
Para abrir o Assistente para Gerar e Publicar Scripts

Estou usando o gerenciador **SQL SERVER Management Studio,**   e recomendo muito seu uso.


#### 1- No Pesquisador de Objetos, 
expanda Bancos de Dados, clique com o botão direito do mouse em um banco de dados, selecione Tarefas e, em seguida, clique em Gerar Scripts. Siga as etapas do assistente para gerar scripts dos objetos de banco de dados.

<img src="/images/doGerarScrbanco_step1cdb.png" class="img-fluid" alt="Gerenciador DB">




#### 2 – Na página Escolher Objetos, 
selecione os objetos a serem incluídos no script, neste caso deixa a opção gerar script de todo o banco e objetos

<img src="/images/GerarScrbanco_step2.png" class="img-fluid" alt="Objetos DB">



#### 3- Na página Definir Opções de Script, 
selecione Salvar scripts em um local específico.

<img src="/images/GerarScrbanco_step3.png" class="img-fluid" alt="Step 3">




#### 3.1- Para especificar opções de script avançadas, 
selecione o botão Avançado na seção Salvar scripts em um local específico.



#### 3.2- Selecione o local para o script gerado: 
em um arquivo, em uma janela do Editor de Consulta do Mecanismo de Banco de Dados ou na Área de transferência.



#### 4- Na página Resumo, revise suas seleções.

<img src="/images/GerarScrbanco_step4.png" class="img-fluid" alt="Step 4">


#### 5- Na página Salvar ou Publicar Scripts, 
monitore o progresso da geração do script.

<img src="/images/GerarScrbanco_step5.png" class="img-fluid" alt="Step 5">



#### DICA EXTRA DOCUMENTAR PROCEDIMENTOS , VIEW E FUNCTION

Confesso que ainda não **achei uma ferramenta que me satisfaça 100% para a documentação de SP, VIEWS e FUNCTIONS**  o que eu faço é simplesmente criar um documento no **WORD ou HTML e escrever lá os parâmetros de cada  SP, FUNCTION E VIEW,** e separar por área de negócio, por exemplo uma Stored Procedure que retorno o preço médio de venda de um determinado produto:


  <img src="/images/Docprocedure.png" class="img-fluid" alt="Step sp">


Das ferramentas gratuitas não encontrei **nenhuma que eu tenha gostado,**  mas assim está funcionando perfeitamente e se houver mudança eu volto a comentar sobre isso..

### É isso, espero que você possam usar estas dicas para documentar seus banco de dados :)
