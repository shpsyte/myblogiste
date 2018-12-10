---
title: Configurar sql em Rede -  Método SQL Browser
date: 2017-12-21T10:15:01+02:00
categories: ["Sql-Server"]
tags: ["sql-server","sql em rede"]
language: pt-br
slug: sql-server-em-rede-modo-sql-browser
author: José luiz
keyword: "SQL, SQL Profile, SQL em Rede"
excerpt: Olá amigos, neste post vou falar sobre o liberar o uso do SQL SERVER em rede utilizando o serviço SQL BROWSER, é um método bastante simples, e garante uma transparência para quem consome o banco de dados, isentando de “conhecer” qual porta conectar. 
draft: false
---

 <!-- {{< youtube VQYVDKxlk2s >}} -->
 
### Obs
Na inicialização do servidor SQL, o **SQL BROWSER** é iniciado e ocupa a porta 1434(UDP), este serviço lê o registro do SQL e identifica todas as instâncias no computador e grava as portas e os pipes nomeados logo ao se conectar, os clientes não precisa determinar a porta e sim a o nome da instância do SQL SERVER. Portanto, o número correto da porta será desconhecido para o cliente.

Vale apena lembra que MESMO com o **SQL BROWSER** desativado é possível a conexão, desde que o cliente “saiba” qual porta foi atribuída a instância, mas uma vez reiniciado a porta poderá mudar.

>SQL Server O Browser não é um recurso clusterizado e não dá suporte ao failover de um nó de cluster para outro. Portanto, no caso de um cluster, o Navegador do SQL Server deve ser instalado e ativado para cada nó do cluster. Em clusters, o Navegador do SQL Server escuta em 


A melhor escolha da forma da liberação vai depender da sua estrutura de sistemas, o que o seu servidor comporta e como ele é acessado.

Logo após a instalação do SQL SERVER, não é possível acessar o servidor por outro computador dentro da mesma rede, isso por que o firewall bloqueia as portas de comunicação, as portas mais comuns são 1433(tcp) e 1434(udp).

### SQL Server em Rede – Método SQL browser

 
#### Step 1: **Inicie** o *SQL SERVER CONFIGURATION MANAGER*
 *iniciar>Microsoft SQL Server XXX>Ferramentas de Configuração>SQL SERVER CONFIGURATION MANAGER*
 <br>
<img src="/images/sqlconfmanager.png" class="img-fluid">

 
<br>

#### Step 2: **Habilite** o serviço SQL BROWSER
<p>Inicie o serviço SQL BROWSER e deixe como inicio automático na guia</p>
<img src="/images/startbrowser.png" class="img-fluid" alt="Tcp Enable">

<br>

#### Step 3: **Altere** a porta do SQL
<p>Altere a porta desejada, nas propriedades IP ADRESSSES deste protocolo, na opção IPAll, o padrão é 1433 e limpe a caixa com a opção TCP Dynamic PORT</p> 
<img src="/images/propertiestcp.png" class="img-fluid" alt="Propriedades Tcp">
<br>


#### Step 4: **Dynamic Porta** 
<p>Coloque uma porta alta na última opção, no campo dynamic port, e deixe a PORT TCP em Branco</p>
<img src="/images/tcpipenable2.png" class="img-fluid" alt="Porta SQL">
<br>

 

#### Step 5: **Adicione Regra** no firewall
<p>Abra o Firewall do Servidor e adicione em regra INBOUND(Entrada) colocando a porta (1434) como UDP, o SQL Browser usa esta porta, continue e salve com um nome apropriado para esta regra.</p>
<img src="/images/addport1434.png" class="img-fluid" alt="Porta 1434 SQL">
<br>



#### Step 6: **Teste Conexão** remota
<p>Efetue um teste de conexão, e envie o nome da instância.</p>
<img src="/images/testeinstance.png" class="img-fluid" alt="Porta 1434 SQL">
<br>


**Com isso já é possível acesso**, caso não seja possível revise se as portas liberadas são as mesmas.

É isso, espero que tenham gostado, até a próxima!
:smile:
