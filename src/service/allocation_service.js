const models = require('../models/models');

async function createAllocation(request) {
  await validateAllocation(request.body);
  return models.Allocation.create(request.body);
}

async function updateAllocation(request) {
  const allocation = await models.Allocation.findById(request.params.id);
  Object.assign(allocation, request.body);
  await validateAllocation(allocation);
  return allocation.save();
}

async function deleteAllocation(request) {
  const allocation = await models.Allocation.findById(request.params.id);
  return allocation.destroy();
}

async function getAllocations(request) {
  if (request.query) {
    const whereParams = {};
    if (request.query.UserId) whereParams.UserId = request.query.UserId;
    if (request.query.AssetId) whereParams.AssetId = request.query.AssetId;
    if (request.query.current) whereParams.endDate = {"$gt": new Date()};
    return models.Allocation.findAll({where: whereParams});
  } else {
    return models.Allocation.findAll();
  }
}

async function getAllocation(request) {
  return models.Allocation.findById(request.params.id);
}

async function validateAllocation(allocation) {
  const errors = await checkAllocation(allocation);
  if (errors.length) {
    const error = new Error();
    error.attributes = errors;
    throw error;
  }
}

async function checkAllocation(allocation) {
  const errors = [];
  if (allocation.startDate >= allocation.endDate) {
    errors.push({
      type: 'Date',
      value: 'Allocation duration is negative'
    });
  }
  errors.push(...await checkUserExists(allocation));
  errors.push(...await checkAssetExists(allocation));
  errors.push(...await checkAvailable(allocation));
  return errors;
}

async function checkUserExists(allocation) {
  const errors = [];
  const user = await models.User.findById(allocation.UserId);
  if (!user) errors.push({
    type: 'UserId',
    value: allocation.UserId
  });
  return errors;
}

async function checkAssetExists(allocation) {
  const errors = [];
  const user = await models.Asset.findById(allocation.AssetId);
  if (!user) errors.push({
    type: 'AssetId',
    value: allocation.AssetId
  });
  return errors;
}

async function checkAvailable(params) {
  const errors = [];
  const userAllocations = await models.Allocation.findAll({where: {UserId: params.UserId}});
  errors.push(...checkAllocationOverlap(params, userAllocations)
    .map(error => {
      error.value = `User allocation ${error.value} overlap`;
      return error;
    }));
  const assetAllocations = await models.Allocation.findAll({where: {AssetId: params.AssetId}});
  errors.push(...checkAllocationOverlap(params, assetAllocations).map(error => {
    error.value = `Asset allocation ${error.value} overlap`;
    return error;
  }));
  return errors;
}

function checkAllocationOverlap(params, otherAllocations) {
  const errors = [];
  otherAllocations.forEach(otherAllocation => {
    if (new Date(params.startDate) <= otherAllocation.dataValues.endDate
      || new Date(params.endDate) >= otherAllocation.dataValues.startDate) {
      errors.push({
        type: 'Date',
        value: otherAllocation.dataValues.id,
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
