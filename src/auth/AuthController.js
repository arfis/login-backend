/**
 * Created by sevcik on 5/9/18.
 */
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var User = require('../user/User');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');

router.post('/login', function(req, res) {
    User.findOne({email:req.body.email}, function(err, person) {
        if (person) {
            var isValidated = bcrypt.compareSync(req.body.password, person.password);

            if (isValidated) {
                console.log(person);
                var token = jwt.sign({name: person.name, role: person.role, email: person.email}, config.secret);
                const {role} = person;
                return res.status(200).send(
                    {
                        token: token,
                        role: role
                    });
            }
        }
        return res.status(404).send({error: 'Bad username/password'})
    })
});

router.post('/register', function(req, res) {

    var hashedPassword = bcrypt.hashSync(req.body.password, 8);

    console.log('creating user: ', hashedPassword);
    User.create({
            name : req.body.name,
            email : req.body.email,
            password : hashedPassword,
            role: req.body.role
        },
        function (err, user) {
            if (err) return res.status(500).send("There was a problem registering the user.")

            // create a token
            var token = jwt.sign({ id: user._id }, config.secret, {
                expiresIn: 86400 // expires in 24 hours
            });

            res.status(200).send({ auth: true, token: token });
        });
});

router.get('/me', function(req, res) {

    var token = req.headers['x-access-token'];
    console.log(token);
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, config.secret, function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

        res.status(200).send(decoded);
    });
});

module.exports = router;