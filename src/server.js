const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const http = require('http');

const models = require('./models/models');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function (request, response) {
  response.send('Hello from Express!')
});

// app.listen(port);
app.set('port', port);

const server = http.createServer(app);
server.listen(port);

// controller

app.get('/user', function (request, response) {
  const id = request.query['id'];
  return models.User.findById(id)
    .then(user => {
      return response.send(user)
    }).catch(e => {
      console.log(e);
      response.status(400);
    });
});
app.post('/user', function (request, response) {
  return models.User.create(request.body)
    .then(user => {
      return response.send(user);
    }).catch(e => {
      console.log(e);
      response.status(400);
    });
});
app.put('/user', function (request, response) {
  const id = request.query['id'];
  response.send('Hello from Express!')
});
app.delete('/user', function (request, response) {
  response.send('Hello from Express!')
});
