const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3001;
const app = express();

var cors = require('cors');
const server = http.createServer(app);
const io = socketio(server);

require('./routes/tweets.js')(app, io);

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());

app.get("/", function(req, res) {
    res.send("App works!!");
  });

server.listen(port, () => {
    console.log('Server is up!');
});