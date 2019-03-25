function Opneva() {
  // var myWindow = window.open("https://webchat.botframework.com/embed/Bot4App?s=W1taz4am4SQ.cwA.tFs.j0hMo-Fc_3Q1XpiWkoexCLgU6zDW81BLIT7WnlUb4uc",
  //  "", "width=500,height=600");
  height = 500
  width = 400
  t = window.innerHeight - height
  l = window.innerWidth - width - 10

  window.open(
    'https://bots4app.azurewebsites.net/chat.html?appid=0012ss22sfs23333&avatar=avatarJose.png&botname=José Luiz - Virtual&placeholder=Ex. Pesquise sobre C#&userid=Visitante&s=ShkEQ9oIn4w.cwA.6mA.m1LIQ4xMWORfAl6r3MJNqoO0uwnzz5qKxmH09PMC61U&css=botconfig ',
    '',
    'height=' + height + ', width=' + width + ', left=' + l + ', top=' + t
  )

  window.open(
    '/chat',
    '',
    'height=' + height + ', width=' + width + ', left=' + l + ', top=' + t
  )
}
