const models = require('../models/models');

async function createAllocation(request) {
  return models.Allocation.create(request.body)
}

async function getAllocations() {
  return models.Allocation.findAll();
}

async function getAllocation(request) {
  return models.Allocation.findById(request.params.id);
}

async function updateAllocation(request) {
  const allocation = await models.Allocation.findById(request.params.id);
  Object.assign(allocation, request.body);
  return allocation.save();
}

async function deleteAllocation(request) {
  const allocation = await models.Allocation.findById(request.params.id);
  return allocation.destroy();
}

function validateAvailable() {
  // TODO: validate user and asset are available
}

export {
  createAllocation,
  getAllocations,
  getAllocation,
  updateAllocation,
  deleteAllocation
};
