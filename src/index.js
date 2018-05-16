var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

var db = require('./db/db');
var UserController = require('./user/UserController');
var AuthController = require('./auth/AuthController');

let activeUsers = new Array();

app.use('/api/auth', AuthController);
app.use('/users', UserController);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/routes/chat.html');
});


io.on('connection', (socket) => {
    const token = socket.handshake.query.token;
    console.log(this.activeUsers);

    this.activeUsers =  (this.activeUsers) ? this.activeUsers : new Array();
    if (token) {
        console.log('a user connected = ', socket.handshake.query.token);

        this.activeUsers.push(token);
        console.log('emitting ', this.activeUsers);
        io.emit('users', this.activeUsers);
    }

    socket.on('disconnect', () => {
        const token = socket.handshake.query.token;

        if (token) {
            console.log('a user disconected = ', socket.handshake.query.token);
            this.activeUsers = this.activeUsers.filter(user => user !== token);
            console.log('emitting ', this.activeUsers);
            io.emit('users', this.activeUsers);
        }
    });

    io.on('connection', (socket) => {
        socket.broadcast.emit('hi');
    });

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
});

http.listen(3001, function(){
    console.log('listening on *:3001');
});


module.exports = app;
