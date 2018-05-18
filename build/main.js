require('/usr/local/lib/node_modules/backpack-core/node_modules/source-map-support/register.js')
module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("mongoose");

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var mongoose = __webpack_require__(2);

var UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: String
});
mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(5);


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var _this = this;

var express = __webpack_require__(0);
var path = __webpack_require__(6);
var favicon = __webpack_require__(7);
var logger = __webpack_require__(8);
var cookieParser = __webpack_require__(9);
var bodyParser = __webpack_require__(1);

var fs = __webpack_require__(10);

var index = __webpack_require__(11);
var users = __webpack_require__(12);

var app = express();

var options = {
    key: fs.readFileSync('/etc/letsencrypt/live/handsomeio.com/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/handsomeio.com/cert.pem')
};

// var http = require('http').Server(app);
var https = __webpack_require__(13);
var io = __webpack_require__(14)(https, { origins: '*:*', transport: ['websocket'] });
io.set('origins', '*:*');

const cors = __webpack_require__(15);

var db = __webpack_require__(16);
var UserController = __webpack_require__(17);
var AuthController = __webpack_require__(18);

let activeUsers = new Array();

app.use(cors());
app.options('*', cors());

app.use('/api/auth', AuthController);
app.use('/users', UserController);

app.use(express.static('client'));
app.get('/', function (req, res) {
    //res.sendFile("chat.html", { root: path.join(__dirname, 'routes') })
});

io.on('connection', socket => {
    const token = socket.handshake.query.token;
    console.log(_this.activeUsers);

    _this.activeUsers = _this.activeUsers ? _this.activeUsers : new Array();
    if (token) {
        console.log('a user connected = ', socket.handshake.query.token);

        _this.activeUsers.push(token);
        console.log('emitting ', _this.activeUsers);
        io.emit('users', _this.activeUsers);
    }

    socket.on('disconnect', () => {
        const token = socket.handshake.query.token;

        if (token) {
            console.log('a user disconected = ', socket.handshake.query.token);
            _this.activeUsers = _this.activeUsers.filter(user => user !== token);
            console.log('emitting ', _this.activeUsers);
            io.emit('users', _this.activeUsers);
        }
    });

    io.on('connection', socket => {
        socket.broadcast.emit('hi');
    });

    socket.on('chat message', msg => {
        io.emit('chat message', msg);
    });
});

server = https.createServer(options, app).listen(443, function () {
    console.log('listning on port 443');
});
io = io.listen(server);
//http.listen(443, function(){
//   console.log('listening on *:3001');
//});


module.exports = app;

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("serve-favicon");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("morgan");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("cookie-parser");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var express = __webpack_require__(0);
var router = express.Router();
/* GET home page. */

module.exports = router;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var express = __webpack_require__(0);
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("https");

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("socket.io");

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = require("cors");

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {


var mongoose = __webpack_require__(2);
mongoose.connect('mongodb://localhost:27017/medical-chat');

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

var express = __webpack_require__(0);
var router = express.Router();
var bodyParser = __webpack_require__(1);

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var User = __webpack_require__(3);

// CREATES A NEW USER
router.post('/', function (req, res) {
    User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }, function (err, user) {
        if (err) return res.status(500).send("There was a problem adding the information to the database.");
        res.status(200).send(user);
    });
});

// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', function (req, res) {
    User.find({}, function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send(users);
    });
});

// GETS A SINGLE USER FROM THE DATABASE
router.get('/:id', function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        res.status(200).send(user);
    });
});

// DELETES A USER FROM THE DATABASE
router.delete('/:id', function (req, res) {
    User.findByIdAndRemove(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem deleting the user.");
        res.status(200).send("User: " + user.name + " was deleted.");
    });
});

// UPDATES A SINGLE USER IN THE DATABASE
router.put('/:id', function (req, res) {
    User.findByIdAndUpdate(req.params.id, req.body, { new: true }, function (err, user) {
        if (err) return res.status(500).send("There was a problem updating the user.");
        res.status(200).send(user);
    });
});

module.exports = router;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by sevcik on 5/9/18.
 */
var express = __webpack_require__(0);
var router = express.Router();
var bodyParser = __webpack_require__(1);
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var User = __webpack_require__(3);

var jwt = __webpack_require__(19);
var bcrypt = __webpack_require__(20);
var config = __webpack_require__(21);

router.post('/login', function (req, res) {
    User.findOne({ email: req.body.email }, function (err, person) {
        if (person) {
            var isValidated = bcrypt.compareSync(req.body.password, person.password);

            if (isValidated) {
                console.log(person);
                var token = jwt.sign({ name: person.name, role: person.role, email: person.email }, config.secret);
                const { role } = person;
                return res.status(200).send({
                    token: token,
                    role: role
                });
            }
        }
        return res.status(404).send({ error: 'Bad username/password' });
    });
});

router.post('/register', function (req, res) {

    var hashedPassword = bcrypt.hashSync(req.body.password, 8);

    console.log('creating user: ', hashedPassword);
    User.create({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        role: req.body.role
    }, function (err, user) {
        if (err) return res.status(500).send("There was a problem registering the user.");

        // create a token
        var token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });

        res.status(200).send({ auth: true, token: token });
    });
});

router.get('/me', function (req, res) {

    var token = req.headers['x-access-token'];
    console.log(token);
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, config.secret, function (err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

        res.status(200).send(decoded);
    });
});

module.exports = router;

/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = require("jsonwebtoken");

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = require("bcryptjs");

/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = {
    'secret': 'supersecret'
};

/***/ })
/******/ ]);
//# sourceMappingURL=main.map