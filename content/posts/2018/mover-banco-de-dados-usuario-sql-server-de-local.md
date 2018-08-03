---
title: "Como mover banco de dados Sql de local"
date: 2018-08-01T21:57:54-03:00
categories: ["Sql-Server"]
tags: ["Sql-Server","Mover banco de dados"]
language: pt-br
slug: mover-banco-de-dados-usuario-sql-server
author: José Luiz
image: https://i.imgur.com/JTH2Wya.png
keyword: "SQL Server"
excerpt: E ai pessoal, tudo bem? Vocês ja precisaram alterar o caminho de um banco de dados SQL Server? Sabe como fazê-lo? Se não este post é para você...
draft: false  
---

<!-- {{< youtube VB-WXFEapBk >}} -->
<img src="https://i.imgur.com/JTH2Wya.png" class="img-fluid" alt="First Results">

#### Banco de dados do usuário
E ai pessoal, tudo bem? Vocês ja precisaram alterar o caminho de um banco de dados SQL Server? Sabe como fazê-lo? Se não sabe então acompanha os passos super simples para você mover o banco de dados sql server
de local.

Este tópico aplica-se a versões do **SQL Server local**, não se aplica ao SQL Azure.

#### Por que mudar ?
Bom, resolvi escrever este post pequeno, pois alguns colegas me perguntaram a *melhor maneira de mover um banco de dados,* já que, antigamente nas instalações **antigas** do nosso sistema deixavamos o local padrão , ou seja: *C:\Programs Files\...\Microsoft\SQL SERVER\...\100\DATA\...\*. 

E isso funciona, mas como nosso cliente não verificavam os backups, :(, tivemos que mudar o local do banco.


#### Comandos
E para isso, os passos são **MEGA SIMPLES**! Antes de mais nada faça um **backup**! 

 A primeira tarefa a fazer é saber onde os arquivos ***estão*** e qual o nome do ***arquivo lógico*** do banco.

 Vamos imaginar que o nome do seu banco seja ***Vancouver***, só para exemplificar aqui.

 Para isso execute o seguinte comando:

 ```sql
  SELECT name, physical_name AS CurrentLocation, state_desc  
    FROM sys.master_files  
   WHERE database_id = DB_ID(N'Vancouver');  
 ```

##### IMPORTANTE:
>Sim o nome lógico do banco pode ser diferente, então, fique atento para usar o nome correto do banco


<img src="https://i.imgur.com/mCrxGKO.png" class="img-fluid" alt="First Results">


Ok, sabemos o nome lógico dos arquivos, ***Data*** e ***Log***, diante disso basta executar os seguintes passos :

1. Deixe o banco OFFLINE
```sql
ALTER DATABASE Vancouver SET OFFLINE;  
```
2. Mova TODOS os arquivos para o novo local.

3. Para cada arquivo movido, execute a seguinte instrução.
```sql
ALTER DATABASE Vancouver MODIFY FILE ( NAME = Data, FILENAME = 'E:\Vancouver.mdf' ); 
ALTER DATABASE Vancouver MODIFY FILE ( NAME = Log, FILENAME = 'E:\Vancouver_log.ldf' ); 
```
4. Por último, execute a seguinte instrução:
```sql
ALTER DATABASE Vancouver SET ONLINE;  
```
5. Para verificar se tudo está OK, execute o comando para verificar se os arquivos foram movidos
 ```sql
  SELECT name, physical_name AS CurrentLocation, state_desc  
    FROM sys.master_files  
   WHERE database_id = DB_ID(N'Vancouver');  
 ```

 Podemos verificar que os arquivos foram movidos:

<img src="https://i.imgur.com/m2tg91k.png" class="img-fluid" alt="Second Results">


<hr>
## Ok, acabamos, mas...
 
Bom, se você estiver movendo por conta de uma falha de hardware, ou falta de energia, algo **catastrófico** hehehe, você pode ter um problema na linha 4(para deixar ONLINE).

##### IMPORTANTE:
>Se o banco de dados não puder ser inicializado, significa que ele está em modo de suspeição ou em estado não recuperado, e apenas os membros de função fixa sysadmin podem mover o arquivo.

1. Interrompa a instância do SQL Server , se tiver sido iniciado.
2. Inicie a instância do SQL Server no modo somente recuperação mestre, inserindo um dos seguintes comandos no prompt de comando.

```DOS
    NET START MSSQL$instancename /f /T3608  
```    

```sql
ALTER DATABASE vancouver MODIFY FILE ( NAME = DATA , FILENAME = 'E:\Vancouver.mdf' );  
ALTER DATABASE Vancouver MODIFY FILE ( NAME = Log, FILENAME = 'E:\Vancouver_log.ldf' ); 
```

3. Pare a instância do SQL Server.
4. Mova o arquivo ou os arquivos para o novo local.
5. Inicie a instância do SQL Server. Por exemplo, execute NET START MSSQLSERVER.
6. Execute a consulta a seguir para verificar se houve alteração no arquivo.

 ```sql
  SELECT name, physical_name AS CurrentLocation, state_desc  
    FROM sys.master_files  
   WHERE database_id = DB_ID(N'Vancouver');  
 ```


 

<Br>
#### É isso ai !
Em casos que o banco fica com a responsabilidade do cliente e que ele não tem uma equipe de TI, é mais fácil para manutenção se a pasta for ***mais acessível***.

***1h do seu tempo perdido com configuração e backup, podem custar milhares de reais ao seu negócio.***

PRODUTIVIDADE é tudo!

Espero que eu possa lhe ajudar neste nova jornada!

Até mais...

:)