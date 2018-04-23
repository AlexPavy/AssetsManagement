const models = require('../models/models');

async function createAssetType(request) {
  return models.AssetType.create(request.body);
}

async function getAssetTypes() {
  return models.AssetType.findAll();
}

async function getAssetType(request) {
  return models.AssetType.findById(request.params.id);
}

async function updateAssetType(request) {
  const assetType = await models.AssetType.findById(request.params.id);
  Object.assign(assetType, request.body);
  return assetType.save();
}

async function deleteAssetType(request) {
  const assetType = await models.AssetType.findById(request.params.id);
  return assetType.destroy();
}

export {
  createAssetType,
  getAssetTypes,
  getAssetType,
  updateAssetType,
  deleteAssetType
};
