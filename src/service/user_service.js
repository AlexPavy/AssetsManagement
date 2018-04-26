const models = require('../models/models');

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

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  getUsers,
  getUser,
};
