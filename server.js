var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var app = express();
var redis = require('redis');

mongoose = require('mongoose');

var port = parseInt(process.env.PORT) || 901;

var client = redis.createClient('//pub-redis-17412.us-east-1-2.1.ec2.garantiadata.com:17412', {no_ready_check: true});
client.auth('mtukxdjMrI9biAno', function (err) { if (err) throw err; });

function redisLog(type) {
    return function () {
        var arguments = (typeof arguments != 'undefined') ? arguments : '';
        console.log(type, arguments);
    }
}
client.on('connect', redisLog('Redis Connection Opened ...'));
client.on('ready', redisLog('Redis Connection Ready ...'));
client.on('reconnecting', redisLog('Redis Connection Reconnecting ... '));
client.on('error', redisLog('Redis Connection Error ...'));
client.on('end', redisLog('Redis Connection End ...'));
//client.set("current_user", JSON.stringify({}), function(err, reply) {
//    console.log('setting : ', err, reply);
//});
var dbURI = 'mongodb://theweave_server:phoenix11@ds025469.mlab.com:25469/heroku_dzkn8fvf';
mongoose.connect(dbURI);
mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open to ' + dbURI);
});
mongoose.connection.on('error',function (err) {
    console.log('Mongoose default connection error: ' + err);
});
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});

app.use(express.static(__dirname + '/files'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/favicon.ico', express.static('./files/img/theweave.ico'));

app.set('json spaces', 2);

require('middleware/routes.js')(app, fs, client);
require('middleware/mongooseModels.js')(app, mongoose);

serverUsers = mongoose.model('p_users', schema.userAccount);
serverSeasons = mongoose.model('p_seasons', schema.serverSeasons);
serverServers = mongoose.model('p_servers', schema.serverServers);
userCharacters = mongoose.model('u_characters', schema.userCharacters);
npcCharacters = mongoose.model('p_npcs', schema.npcCharacters);

var server = app.listen(port || 901, function() {
    console.log("listening on " + port);
});




var io  = require('socket.io').listen(server);

var usernames = {};
var numUsers = 0;
var users = io.sockets;

io.on('connection', function (socket) {
    var addedUser = false;

    socket.on('new message', function (data) {
        socket.broadcast.emit('new message', {
            username: socket.username,
            message: data
        });
    });

    socket.on('add user', function (username) {
        socket.username = username;
        usernames[username] = username;
        ++numUsers;
        addedUser = true;
        socket.emit('login', {
            numUsers: numUsers,
            listUsers : usernames
        });
        socket.broadcast.emit('user joined', {
            username: socket.username,
            listUsers : usernames,
            numUsers: numUsers
        });
    });

    socket.on('typing', function () {
        socket.broadcast.emit('typing', {
            username: socket.username
        });
    });

    socket.on('stop typing', function () {
        socket.broadcast.emit('stop typing', {
            username: socket.username
        });
    });

    socket.on('disconnect', function () {
        if (addedUser) {
            delete usernames[socket.username];
            --numUsers;
            socket.broadcast.emit('user left', {
                username: socket.username,
                numUsers: numUsers,
                listUsers : usernames
            });
        }
    });
});
