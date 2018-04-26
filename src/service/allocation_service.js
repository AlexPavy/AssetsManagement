const models = require('../models/models');

async function createAllocation(request) {
  validateAllocation(request.body);
  return models.Allocation.create(request.body);
}

async function updateAllocation(request) {
  const allocation = await models.Allocation.findById(request.params.id);
  Object.assign(allocation, request.body);
  validateAllocation(allocation);
  return allocation.save();
}

async function deleteAllocation(request) {
  const allocation = await models.Allocation.findById(request.params.id);
  return allocation.destroy();
}

async function getAllocations() {
  return models.Allocation.findAll();
}

async function getAllocation(request) {
  return models.Allocation.findById(request.params.id);
}

function validateAllocation(allocation) {
  const errors = checkAllocation(allocation);
  if (errors.length) {
    const error = new Error();
    error.attributes = errors;
    throw error;
  }
}

function checkAllocation(allocation) {
  const errors = [];
  if (allocation.startDate === allocation.endDate) {
    errors.push({
      type: 'date',
      value: 'Allocation duration is 0'
    });
  }
  errors.push(...checkAvailable(allocation));
  return errors;
}

async function checkAvailable(allocation) {
  const errors = [];
  const userAllocations = await models.Allocation.findAll({ where: { userId: allocation.userId } });
  errors.push(...checkAllocationOverlap(allocation, userAllocations)
    .map(error => {
     error.value = 'User allocation' + error.value;
     return error;
  }));
  const assetAllocations = await models.Allocation.findAll({ where: { assetId: allocation.assetId } });
  errors.push(...checkAllocationOverlap(allocation, assetAllocations).map(error => {
    error.value = 'Asset allocation' + error.value;
    return error;
  }));
  return errors;
}

function checkAllocationOverlap(allocation, otherAllocations) {
  const errors = [];
  otherAllocations.forEach(otherAllocation => {
    if (allocation.startDate < otherAllocation.dataValues.endDate
      || allocation.endDate > otherAllocation.dataValues.startDate) {
      errors.push({
        type: 'Date',
        value: otherAllocations.id
      });
    }
  });
  return errors;
}

module.exports = {
  createAllocation,
  updateAllocation,
  deleteAllocation,
  getAllocations,
  getAllocation,
};
