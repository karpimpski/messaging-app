var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongo = require('mongodb').MongoClient;
var url = process.env.DB_URI;
var names = [];
var port = (process.argv[2]) ? process.argv[2] : process.env.PORT;

app.use(express.static(__dirname + '/client/build'));

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
		console.log(socket.name + ' connected');
		names.push(socket.name);
		mongo.connect(url, function(err, db){
			db.collection('users').insert({name: socket.name});
		});
	});

	socket.on('chatMessage', function(from, msg){
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
		mongo.connect(url, function(err, db){
			db.collection('users').remove({name: socket.name});
		})
		io.emit('chatMessage', 'System', `<b>${socket.name}</b> has disconnected.`);
		console.log(socket.name + ' disconnected');
		socket.disconnect();
	}
});

app.get('/api/user/:user', function(req, res){
	mongo.connect(url, function(err, db){
		db.collection('users').findOne({name: req.params.user}, function(err, doc){
			res.end(JSON.stringify(doc));
		});
	});
});

app.get('*', function(req, res){
	res.sendFile(__dirname + '/client/build/index.html');
})

http.listen(port, function(){
  
});