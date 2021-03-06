const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')
const name = document.getElementById("user").innerHTML
const number = document.getElementById('user-list')
const userOn = document.getElementById('userOn')
const userName = document.getElementById('userName')
const chatConteriner = document.getElementById('chatConteriner')
const audio = document.getElementById('notifier')
//const timeS = document.getElementById('time')
//const feedback = document.getElementById('feedback')

// document.getElementById("send-container").onkeypress = function(e) {
//   var key = e.charCode || e.keyCode || 0;
//   if (key == 13) {
//     e.preventDefault();
//   }
// }

// on chat enter___________________________________________________________
appendMessage('You joined')
socket.emit('new-user', name)
socket.emit('updateList')
socket.emit('datime')
//time()

//sending message___________________________________________________________
socket.on('chat-message', data =>{
  //time()
  //feedback.innerHTML = ''
  notif()
  appendMessage(`${data.name} ${data.time }
    ${data.message}`)
  //console.log(data)
  scroller()
})

// new user connects________________________________________________________
 socket.on('user-connected', name =>{
   appendMessage(`${name} is connected`)
   scroller()
   //time()
   socket.emit('updateList')
 })

// user disconects__________________________________________________________
 socket.on('user-disconnected', name =>{
   if (!name){

   }else {
     socket.emit('updateList')
     appendMessage(`${name} disconnected`)
     scroller()
     //time()
   }
 })

//updating online users______________________________________________________
 socket.on('updateUsersList',number =>{
   const connecters = JSON.stringify(number.user)

   //const regex = "socket_username"
   result = connecters.replace(/socket_username/g, " ");
   daresult = result.replace(/[.*+?^"":${}()|[\]\\]/g, " ")
   const text = document.getElementById("userOn").innerHTML = ('Online : ' + number.number + ' &nbsp'+'Users :' + daresult)
   //const dausers = document.getElementById("userName").innerHTML = ('Online ' + daresult)
 })

//Reload_____________________________________________________________________
 socket.on('reload', function (data) {
    location.reload();
 });
 // socket.on('typing', (name) =>{
 //   feedback.innerText = 'Someone is typing a message...'
 //   console.log(feedback)
 // })

// socket.on('reconnect-user', name =>{
//   appendMessage(`${name} reconnected`)
//
// })

//form submit________________________________________________________________
messageForm.addEventListener('submit', e =>{
  e.preventDefault()
  const message = messageInput.value
  if(!messageInput.value || name === undefined){
    // no value wont send message
  } else {

    appendMessage(`You
      ${message}`)
    socket.emit('send-chat-message', message)
    messageInput.value = ''
    //console.log('called ')
    scroller()
  }

})


 // feedback.addEventListener('keypress', () =>{
 //   socket.emit('typing', name)
 // })

// message function__________________________________________________________
function appendMessage(message){
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageContainer.append(messageElement)

}
//scroll down function_______________________________________________________
function scroller(){
  const elem = document.getElementById('chatConteriner');
  elem.scrollTop = elem.scrollHeight;
}

// function time(timeS){
//   const now = new Date();
//   const epoch_millis = now.getTime();
//   //console.log(epoch_millis)
//
//   var utcSeconds = epoch_millis;
//   var str = new Date(utcSeconds);
//
//   //convertsToString
//   var s = str.toString();
//
//   //formating data TIME
//   var timeS = s.substr(16,5);
//   var TDate = s.substr(0,15);
//   const timeru = document.getElementById('time').innerHTML = timeS;
//   //document.getElementById('headline').innerHTML = timeS;
//   console.log(timeS)
// }

  function notif(){
    console.log('sound played')
    //  const audio = new Audio({
    //   src: ["sounds/consolesoundmaybe.ogg"],
    //   autoplay: true
    // });
    audio.play();
  }
