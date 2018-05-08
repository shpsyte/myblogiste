---
title: "A Melhor Alternativa Para Cursor Em Sql Server, existe ?"
date: 2018-05-06T13:32:39-03:00
categories: ["Sql-Server"]
tags: ["sql-server","performance-sql-server"]
language: pt-br
slug: a-melhor-alternativa-para-cursor-em-sql-server
image: https://i.imgur.com/dfUvFr1.png
author: José luiz
keyword: "Cursor em SQL Server, Como Evitar Cursor, Performance SQL Server"
excerpt: Será que o Cursor em Sql Server não é exatamente a melhor opção para percorrer registros pela performance que ele impacta no banco ?
draft: false
---

 {{< youtube 4b1aCokk4ps >}}

<br>

#### Cursor em SQL Server
Ok, eu vi bastante post falando sobre ***performance em Cursores***. Os cursores são simples de usar e possibilitam aos programadores uma dezenas de possibilidades, pois permite que percorrer registros dado uma instrução SQL. Mas, será que sua performance é viável ?


<Br>
#### 1. Trabalhando com ***CURSORES em SQL Server*** ? 
Antes, como usamos o cursor ? No código abaixo é possível verificar sua sintax. 

Vamos imaginar que devemos percorrer cada cliente da nossa tabela de *Invoice*, para executar uma 
operação qualquer... e estaremos limitando a 10.000 registros.

```SQL

-- Criamos nossas variaveis para ser usada no curor
DECLARE @id INT, @firstName VARCHAR(100), @email VARCHAR(100)
 
-- Declara o Cursor para percorrer os registros
DECLARE meuCursor CURSOR FOR
  SELECT  TOP 1000 a.ID, a.FirsName, a.Email FROM Invoice a -- Nossa INSTRUÇÃO SQL
OPEN meuCursor --Abre nosso Cursor
WHILE 1=1 -- Sim isso mesmo 1=1
BEGIN
  FETCH NEXT FROM meuCursor INTO @id, @firstName, @Email -- Lendo a próxima linha
  IF @@FETCH_STATUS <> 0 BREAK -- Se não houver mais registro, o cursor é finalizado
   --- .... NOSSOS OPERAÇÃO QUALQUER CodeSQL
   --- .... CODIGO OMITIDO
END
CLOSE  meuCursor --fecha nosso cursor
DEALLOCATE  meuCursor --retira da memória

```
<small>Existe outras sintax para criar um cursor, vale apenas dar uma olhada na documentação completa,
<a href="https://docs.microsoft.com/en-us/sql/t-sql/language-elements/cursors-transact-sql?view=sql-server-2017"
 target="_blank">aqui</a> </small>


Em nosso exemplo simples, o SQL SERVER levou 1.7 seg para efetuar todos os cálculos ***Código omitido***. Se pensarmos que este procedimento pode ser chamado por muitos usuários, o que isso custaria para nosso servidor e aplicação ?



<br>
#### As alternativas oferecidas
### 1. Parece óbvio, mas....
Bom, parece óbvio, mas a **primeira alternativa** é analisar se precisamos mesmo de um **Cursor**, muitas vezes nosso objetivo é tão simples que usamos o cursor sem pensar, e consegimos o mesmo objetivo com apenas uma instrução SQL.

<br>
### 2. Tabelas temporárias
Mas se este não for o caso, eu li alguns posts sobre **tabela temporária**, adicionar nossos dados la dentro e manipular com o **WHILE**

Vamos testar isso... criar uma tabela como variável e trabalhar com o "laço" dentro delas. 

```sql
-- Criamos nossas variaveis para ser usada no curor
DECLARE @ID INT, @firstName VARCHAR(100), @email VARCHAR(100)

-- Criamos nossas tabela variaveis para ser usada no curor
DECLARE @table TABLE (PK INT PRIMARY KEY IDENTITY(1,1), ID INT, FirstName VARCHAR(100), Email VARCHAR(100))

--Insert em nossa temp table
INSERT INTO @table
SELECT TOP 1000 A.ID, a.FirsName, a.Email FROM Invoice a

-- cursor +otimizado
WHILE (SELECT COUNT(ID) from @table) > 0
BEGIN
  SELECT TOP 1 @id = ID, @firstName = FirstName, @email = Email FROM @table T

   --- .... NOSSOS OPERAÇÃO QUALQUER CodeSQL
   --- .... CODIGO OMITIDO

-- REMOVE O REGISTRO DA TABELA TMP PARA QUE O WHILE PEGUE A PRÓXIMA LINHA
DELETE FROM @table WHERE ID = @ID
END

```

Usando o mesmo ***Código omitido*** nosso algoritmo levou 4.96, MAS , não era para ser melhor ?

O problema esta em duas linhas :

```sql
-- linha com problema
WHILE (SELECT COUNT(ID) from @table) > 0

-- e na linha
DELETE FROM @table WHERE ID = @ID
```

Fazer um COUNT na tabela temporária e depois efetuar o delete tem alto custo para o servidor, já que vai acessar o disco rígido para fazer tais operações...

<br>
### 3. Otimizando o uso de tabelas temporárias
Vamos tentar otimizar o uso de **tabelas temporárias** alterando nosso script


```sql
-- Criamos nossas variaveis para ser usada no curor
DECLARE @ID INT, @firstName VARCHAR(100), @email VARCHAR(100)

DECLARE @Count INT, @i INT = 1

-- Criamos nossas tabela variaveis para ser usada no curor
DECLARE @table TABLE (PK INT PRIMARY KEY IDENTITY(1,1), ID INT, FirstName VARCHAR(100), Email VARCHAR(100))

INSERT INTO @table
SELECT  TOP 10000 A.ID, a.FirsName, a.Email FROM Invoice a

SELECT @Count = COUNT(PK) FROM @table

WHILE (@i <= @count)
BEGIN
  SELECT TOP 1 @id = ID, @firstName = FirstName, @email = Email FROM @table WHERE PK = @i

  --- .... NOSSOS OPERAÇÃO QUALQUER CodeSQL
  --- .... CODIGO OMITIDO

 SELECT @i = @i + 1
END
```

Executamos o mesmo script, e o SQL levou 1.4 segundos para finalizar, a melhor opção das 3.

<br>
### 4. Otimizando o próprio cursor
Existem outra técnica, que não vejo muito em posts e tão pouco em programação, usar 3 palavras reservadas 
**FAST_FORWARD** , **FORWARD_ONLY** e **READ_ONLY**, estas sim irão fazer nosso **cursor** ser mais rápido.

a declaração deste tipo de cursor é igual, salvo da seguinte linha:

```sql
  DECLARE meuCursor CURSOR FAST_FORWARD FORWARD_ONLY READ_ONLY FOR
```
Executamos o mesmo script, e o SQL levou 35seg para finalizar!
Mas o que significam ?

**FAST_FORWARD, FORWARD_ONLY**: diz para o sql habilitar a otimização de desempenho no cursor 
**READ_ONLY**: Previne a atualização feitas por este cursor, não deveria mas depois de 10 anos o cursor fica mais otimizado.


> **FAST_FORWARD** **READ_ONLY** **READ_ONLY**, são opcionais, mas se você quer aumentar sua peformance considere adicionar estas três **keyword** em seus cursores, desde que não precise manipular a linha do cursor ou voltar linhas..


<table class="table table-light ">
<thead>
  <th> Recurso </th>
  <th> Tempo em Segundos </th>
</thead>
<tbody>
  <tr>
     <td>  Cursor  </td>
     <td>  1.7  </td>
  </tr>

  <tr>
     <td>  Tab. Temp Normal  </td>
     <td>  4.96  </td>
  </tr>

  <tr class="text-success font-weight-bold">
     <td>  Tab. Temp Otimizada  </td>
     <td>  1.4  </td>
  </tr>

  <tr class="text-success font-weight-bold">
     <td>  Cursor Otimizado  </td>
     <td>  1.4  </td>
  </tr>  
  </tbody>
</table>


<br>
#### O que usar ?
Eu sei que vai soar **Clichê**, mas realmente depende muito do cenário, não sei se compensa **trocar toda uma idéia/lógica** DO CURSOR por tabelas temporárias, e é bem verdade que ao longo destes anos o **SQL tem melhorado sua performance**, então pegar um conceito da versão 2000 para aplicar na versão 2017, só por aplicar não faz sentido.


Então :

* Se usar *CURSOR SIMPLES*, otimize ele com as palavras *FAST_FORWARD, FORWARD_ONLY, READ_ONLY*
* É muito comum atribuírmos performance aos recursos do SQL, mas lhe garanto que 90% vem de código mal escrito 
* Tente guardar algum cálculo no ato que ela ocorreu, assim você só tem a leitura e não o cálculo



<br>
### Resumo
O uso de **Cursores** é uma parte comum a programadores, use **concientemente em seu desenvolvimento**, sempre visando  a performance do banco, mas não se prenda a **paradigmas antigos**, a melhor performance é a leitura e aprendizado da ferramenta a ser usada.


É isso, até mais...
 :) 

