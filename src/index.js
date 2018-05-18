var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var fs = require('fs');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

var options = {
    key: fs.readFileSync('/etc/letsencrypt/live/handsomeio.com/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/handsomeio.com/cert.pem'),
};

// var http = require('http').Server(app);
var https = require('https');
var io = require('socket.io')(https,{ origins: '*:*', transport: ['websocket']});
io.set('origins', '*:*');

const cors = require('cors');

var db = require('./db/db');
var UserController = require('./user/UserController');
var AuthController = require('./auth/AuthController');

let activeUsers = new Array();

app.use(cors());
app.options('*', cors());

app.use('/api/auth', AuthController);
app.use('/users', UserController);



app.use(express.static('client'));
app.get('/', function(req, res) {
//res.sendFile("chat.html", { root: path.join(__dirname, 'routes') })
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

server = https.createServer(options, app).listen(443, function() {
	console.log('listning on port 443');
});
io = io.listen(server);
//http.listen(443, function(){
 //   console.log('listening on *:3001');
//});


module.exports = app;
