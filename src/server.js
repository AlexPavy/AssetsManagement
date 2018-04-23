const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const http = require('http');
const router = require('./router');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(router);

app.set('port', port);
const server = http.createServer(app);
server.listen(port);

app.get('/', function (request, response) {
  response.send('Welcome to asset management test')
});


module.exports = app;
