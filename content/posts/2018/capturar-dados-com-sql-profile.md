---
title: "Capturar dados com SQL Profile"
date: 2018-03-09T08:00:22-03:00
categories: ["Sql-Server"]
tags: ["Sql-Server","Sql-Profiler","Capturar Dados SQL"]
language: pt-br
slug: capturar-dados-com-sql-profiler
author: José Luiz
keyword: "SQL, SQL Profile"
excerpt: Olá galera, este post é para quem está iniciando a programação em banco de dados, e na maioria  as vezes o aspirante a DBA começa a desenvolver pequenos relatórios para atender a necessidades especificas, mas ai vem a dúvida, como saber de onde pegar os dados ?
draft: false  
---



 <!-- {{< youtube VB-WXFEapBk >}} -->

#### SQL profiler
Olá galera, este post é para quem está iniciando a programação em banco de dados, e na maioria  as vezes o **aspirante a DBA** começa a desenvolver pequenos relatórios para atender a necessidades específicas, mas ai vem a dúvida, como saber de onde pegar os dados ?

Este tópico aplica-se a versões do SQL Server 2000 a 2016, **SQL Server Profiler** é uma ótima ferramenta de rastreamento, os eventos são salvos em um arquivo de rastreamento que posteriormente pode ser analisado ou utilizado para reproduzir uma série de etapas na tentativa de diagnosticar um problema.

![Alt text](/images/sqlserverprofile.png "Sql Server Profiler")


##### IMPORTANTE:
>A Microsoft está anunciando o fim do **SQL Server Profiler** para as versões superiores a 2016, eles serão substituídos pelo **Trace Capture** e o **Trace Replay**. Esses recursos estão disponíveis no SQL Server 2016, mas serão removidos em uma versão posterior.

Mas

>O SQL Server Profiler para as cargas de trabalho do Analysis Services NÃO está sendo  preterido e o suporte a ele continuará.

Bom, mesmo com a notícia, muitas empresas usam versôes do SQL que suportam a ferramenta, e além disso, eu acredito que vamos usar o profile em bancos com a versão 2017. :)






#### O problema?    
Bom, não é **um problema** e sim uma **oportunidade**, mas imaginem que vocês recebam uma tarefa de criar um relatório que mostre dados dos clientes e seus valores em aberto no financeiro.
Se você não conheçe a estrutura do banco, o **SQL Profile** vai te ajudar.



Bom para começar o nosso desenvolvimento, vamos simular as telas do nosso sistema para capturar os dados
e começar a fazer nossos *select's*.


### 1. Inicie o SQL Server Profile
***Abra o SQL Management Studio*** e vá no menu *Ferramentas: SQL Server profile*, ou pelo atalho *ctrl+alt+p* dentro de uma consulta sql.
Estou assumindo que você já use o **SSMS** mas se não usa, você pode abrir o profile através do caminho

*C:\Program Files (x86)\Microsoft SQL Server\140\Tools\Binn\PROFILER.exe* onde **140** é minha versão do SSMS;

<img src="/images/sqlserverprofilepath.png" class="img-fluid" alt="Sql Server Profiler">


### 2. Conecte na instância do seu banco
Você deve ser membro do SQL Audit ou SA para poder executar esta ferramenta.

<img src="/images/sqlserverprofileconect.png" class="img-fluid" alt="Sql Conect Profiler">


### 3. Defina os parâmetros de rastreamento
##### 3.1 Modelo
Aqui é um passo importante, no campo *Usar o modelo* defina ***TSQL_SPs***, isso fara que o profile capture T-SQL puro, Stored Procedures, Triggers, Functions, além de permitir usar o próximo filtro.
Existem outros modelos, mas para este Post estamos interessados em rastrear instruções SQL.

<img src="/images/profiler_property.png" class="img-fluid" alt="Sql Conect ProfileR">

##### 3.2 Filtro
Acesse a aba  *Seleção de eventos*, nesta aba você ira filtrar o que deseja capturar. Se deixar em branco será bem mais complicado entender a captura, já que ele vai capturar tudo, independente de quem esteja usando o banco naquele momento e só queremos pegar nossa sistema.

Vou falar apenas de 2 colunas:

* **Databasename**: Defina o nome do banco que deseja capturar
* **SPID**: Cada conexão recebe uma identificação única, e este é o mais indicado pois a maioria dos sistemas mostram qual o número da sessão, se você souber a sua sessão use esta opção.

Em nosso caso, vou simular uma tela de um sistema da WEB, logo vou apenas definiar o nome do banco.

<img src="/images/profiler_property_filter.png" class="img-fluid" alt="Sql Filter Profiler">

### 4. Começe a captura
Ao clicar no botão *OK* o SQL Profile já vai começar a capturar tudo. Desde SQL, INSERT, UPDATE...
mágico não é mesmo ;)

<img src="/images/sqlprofiletrace.PNG" class="img-fluid" alt="Sql Filter Profiler Trace">



### 5. Calma, ainda não acabou
E a nossa oportunidade ?

***De criar um relatório que mostre dados dos clientes e seus valores em aberto no financeiro.***

Fácil, basta agora ***navegar nas telas do sistema*** e identificar no profile quais são as tabelas que ele utiliza

#### 5.1 Dados de clientes
Ao navegar na tela de clientes, identifico a instrução abaixo
<img src="/images/table_person.PNG" class="img-fluid" alt="Sql Filter Profiler Trace">


#### 5.1 Dados do financeiro
E ao navegar na tela de finanças, identifico a instrução abaixo
<img src="/images/table_financial.PNG" class="img-fluid" alt="Sql Filter Profiler Trace">


#### Pronto
Agora que sabemos a origem das informações basta criar nosso relatório
```sql
    SELECT Name, LastName, FinancialValue
      FROM [Person].[Person] customer 
INNER JOIN [Financial].[Revenue] finance ON customer.ID = finance.ID
```



### Resumindo
Eu sei que dba já estão *cansados* de usar o **SQL SERVER Profile**, mas existem muitas pessas que estão começando e é uma ótima ferramenta de mineiração de dados, mas ela tem outras serventias einh, como 
analisar LOG, Tunning, espero que ajude assim como me ajudou no começo da minha carreira...

Abraços e até a próxima...
