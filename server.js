var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var names = [];
var mongoose = require('mongoose');
var port = (process.argv[2]) ? process.argv[2] : process.env.PORT;

mongoose.connect(process.env.DB_URI);
app.use(express.static(__dirname + '/client/build'));

var User = require('./models/user.js')

io.on('connection', function(socket){
	var socketName;
	var seconds = 0;
	var interval = setInterval(function(){
		seconds += 1;
		if(seconds >= 3600){
			clearInterval(interval);
			disconnect();
		}
	}, 1000);

	socket.on('newUser', function(name){
		socket.name = name;
		names.push(socket.name);
		User({username: socket.name}).save((err) => {if(err) throw err});
	});

	socket.on('chatMessage', function(from, msg){
		if(from == socket.name){seconds = 0}
		io.emit('chatMessage', from, msg);
	});

	socket.on('notifyUser', function(user){
		io.emit('notifyUser', user);
	});

	socket.on('disconnect', function(){
		disconnect();
	});

	function disconnect(){
		var index = names.indexOf(socket.name);
		names.splice(index, 1);
		User.findOneAndRemove({ username: socket.name }, function(err) {
		  if (err) throw err;
		});
		io.emit('chatMessage', 'System', `<b>${socket.name}</b> has disconnected.`);
		socket.disconnect();
	}
});

app.get('/api/user/:user', function(req, res){
	User.find({username: req.params.user}, function(err, users){
		if(err) throw err;
		users[0] ? res.end(JSON.stringify(users[0])) : res.end(JSON.stringify(false));
	})
});

app.get('/api/users', function(req, res){
	User.find({}, function(err, users){
		if(err) throw err;
		res.end(JSON.stringify(users));
	})
})

app.get('*', function(req, res){
	res.sendFile(__dirname + '/client/build/index.html');
})

http.listen(port, function(){
  
});