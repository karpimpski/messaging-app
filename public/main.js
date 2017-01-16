var socket;

var userEl = document.getElementById('user');
var m = document.getElementById('m');
var messages = document.getElementById('messages');
var notifyUser = document.getElementById('notifyUser');

document.getElementById('username').addEventListener('submit', function(e){
  e.preventDefault();
  var name = document.getElementById('name').value;
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var res = JSON.parse(xhttp.responseText);
      if(res == null){
        enter(name);
      }
      else{
        alert('Sorry! That name is already taken.');
      }
    }
  };
  xhttp.open("GET", "/api/user/" + name, true);
  xhttp.send();
});

function enter(name){
  document.getElementById('login').classList.add('hidden');
  document.getElementById('chat').classList.remove('hidden');
  userEl.value = name;
  socket = io({query: 'name=' + name});
  socket.emit('newUser', name);
  socket.emit('chatMessage', 'System', '<b>' + name + '</b> has joined the discussion');
  setSocketListeners();
}

document.getElementById('form').addEventListener('submit', function(e){
	e.preventDefault();
	var from = userEl.value;
	var message = m.value;
	if(message !== ''){
		socket.emit('chatMessage', from, message);
	}
	m.value = '';
	return false;
});

function setSocketListeners(){
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
      notifyUser.classList.add('active');
    }
    setTimeout(function(){ 
      notifyUser.classList.remove('active');
      setTimeout(function(){
        notifyUser.innerHTML = '';
      }, 500)
    }, 10000);;
  });
}

function notifyTyping(){
	var user = userEl.value;
	socket.emit('notifyUser', user);
}