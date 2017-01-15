var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongo = require('mongodb').MongoClient;
var url = process.env.DB_URI;

var clients = [];
var names = [];

app.get('/', function(req, res){
	app.use(express.static(__dirname + '/public'));
	res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(socket){
	console.log('user connected');
	clients.push(socket);

	socket.on('newUser', function(name){
		names.push(name);
		mongo.connect(url, function(err, db){
			db.collection('users').insert({name: name});
		});
	});

	socket.on('chatMessage', function(from, msg){
		io.emit('chatMessage', from, msg);
	});

	socket.on('notifyUser', function(user){
		io.emit('notifyUser', user);
	});

	socket.on('disconnect', function(){
		var index = clients.indexOf(socket);
		var name = names[index];
		clients.splice(index, 1);
		names.splice(index, 1);
		mongo.connect(url, function(err, db){
			db.collection('users').remove({name: name});
		})
		io.emit('chatMessage', 'System', `<b>${name}</b> has disconnected.`);
		console.log(socket + ' disconnected');
	});
});

app.get('/api/user/:user', function(req, res){
	mongo.connect(url, function(err, db){
		db.collection('users').findOne({name: req.params.user}, function(err, doc){
			res.end(JSON.stringify(doc));
		});
	});
});

http.listen(process.env.PORT, function(){
  
});