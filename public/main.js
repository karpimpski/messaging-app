var socket = io();

var userEl = document.getElementById('user');
var name = makeid();
var m = document.getElementById('m');
var messages = document.getElementById('messages');
var notifyUser = document.getElementById('notifyUser');

userEl.value = name;
socket.emit('chatMessage', 'System', '<b>' + name + '</b> has joined the discussion');

document.getElementById('form').addEventListener('submit', function(e){
	e.preventDefault();
	var from = userEl.value;
	var message = m.value;
	if(message !== ''){
		socket.emit('chatMessage', from, message);
	}
	m.value = '';
	return false;
})

function notifyTyping(){
	var user = userEl.value;
	socket.emit('notifyUser', user);
}

socket.on('chatMessage', function(from, msg){
  var me = userEl.value;
  var color = (from == me) ? 'green' : '#009afd';
  var from = (from == me) ? 'Me' : from;
  messages.innerHTML += '<li><b style="color:' + color + '">' + from + '</b>: ' + msg + '</li>';
});

socket.on('notifyUser', function(user){
  var me = userEl.value;
  if(user != me) {
    notifyUser.innerHTML = user + ' is typing ...';
  }
  setTimeout(function(){ notifyUser.innerHTML = ''; }, 10000);;
});

function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
 
  for( var i=0; i < 5; i++ ) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}