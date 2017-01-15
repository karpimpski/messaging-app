var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
	app.use(express.static(__dirname + '/public'));
	res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(socket){
	socket.on('chatMessage', function(from, msg){
		io.emit('chatMessage', from, msg);
	});

	socket.on('notifyUser', function(user){
		io.emit('notifyUser', user);
	});
})

http.listen(process.env.PORT, function(){
  
});