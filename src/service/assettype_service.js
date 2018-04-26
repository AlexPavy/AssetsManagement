const models = require('../models/models');

async function createAssetType(request) {
  validateAssetType(request.body);
  return models.AssetType.create(request.body);
}

async function updateAssetType(request) {
  const assetType = await models.AssetType.findById(request.params.id);
  Object.assign(assetType, request.body);
  validateAssetType(request.body);
  return assetType.save();
}

async function deleteAssetType(request) {
  const assetType = await models.AssetType.findById(request.params.id);
  return assetType.destroy();
}

async function getAssetTypes() {
  return models.AssetType.findAll();
}

async function getAssetType(request) {
  return models.AssetType.findById(request.params.id);
}

function validateAssetType(assetType) {
  const errors = checkAssetType(assetType);
  if (errors.length) {
    const error = new Error();
    error.attributes = errors;
    throw error;
  }
}

function checkAssetType(assetType) {
  const errors = [];
  for (const key in assetType.attributeTypes) {
    if (!Object.keys(assetType.attributeTypes[key]).includes("jstype")) {
      errors.push({
        type: key,
        value: 'Missing jstype'
      })
    }
  }
  return errors;
}

module.exports = {
  createAssetType,
  updateAssetType,
  deleteAssetType,
  getAssetTypes,
  getAssetType,
};
