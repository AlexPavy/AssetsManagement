const express = require('express');
const models = require('./models/models');

const router = express.Router();
router
  .route('/users')
  .get((req, res) => apiMethodWrapper(getUsers, req, res))
  .post((req, res) => apiMethodWrapper(createUser, req, res));
router
  .route('/users/:id')
  .get((req, res) => apiMethodWrapper(getUser, req, res))
  .patch((req, res) => apiMethodWrapper(updateUser, req, res))
  .delete((req, res) => apiMethodWrapper(deleteUser, req, res));

async function createUser(request) {
  return models.User.create(request.body)
}

async function getUsers() {
  return models.User.findAll();
}

async function getUser(request) {
  return models.User.findById(request.params.id);
}

async function updateUser(request) {
  const user = await models.User.findById(request.params.id);
  Object.assign(user, request.body);
  return user.save();
}

async function deleteUser(request) {
  const user = await models.User.findById(request.params.id);
  return user.destroy();
}

function apiMethodWrapper(routeMethod, request, response) {
  return routeMethod(request)
    .then(res => {
      return response.send(res)
    })
    .catch(e => {
      console.log(e);
      response.status(400);
    });
}

module.exports = router;