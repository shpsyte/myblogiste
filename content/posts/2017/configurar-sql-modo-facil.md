---
title: Configurar sql em Rede - Via Porta.
date: 2017-11-21T10:15:01+02:00
categories: ["Sql-Server"]
tags: ["sql-server","sql em rede"]
language: pt-br
slug: sql-server-em-rede-modo-facil
author: José luiz
keyword: "SQL, SQL Profile, SQL em Rede"
excerpt: Olá amigos, neste post vou falar sobre o liberar o uso do SQL SERVER em rede utilizando apenas a liberação da porta dentro do firewall, é um método bastante simples. 
draft: false
---

 <!-- {{< youtube t095JhqXduQ >}} -->
 <!-- <img src="https://i.imgur.com/QFWmhnW.png" class="img-fluid" alt="Rename DATABASE"> -->

### Obs
Vale apena lembra que existem muitas maneiras de fazer este procedimento, esta é apenas uma delas e não estou usando o SQL BROWSER.

A melhor escolha da forma da liberação vai depender da sua estrutura de sistemas, o que o seu servidor comporta e como ele é acessado.

Logo após a instalação do SQL SERVER, não é possível acessar o servidor por outro computador dentro da mesma rede, isso por que o firewall bloqueia as portas de comunicação, as portas mais comuns são 1433(tcp) e 1434(udp).

 
### Liberando acesso do SQL Server em Rede

Existem ao menos duas maneiras de efetuar esta liberação, devemos pensar na estrutura atual e futura do nosso servidor. Esta é uma questão MUITO IMPORTANTE para a segurança da informação.

Tenha em foco que:

*  A porta padrão é 1433 TCP ou 1434 UDP, mas não precisa liberar as duas portas!
*  Mudar a porta é boa opção, mas não garante um segurança efetiva

 

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
