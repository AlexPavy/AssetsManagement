const models = require('../models/models');

async function createAsset(request) {
  const assetParams = request.body;
  const assetType = models.AssetType.findById(assetParams.assetTypeId);
  const errors = validateAttributes(assetParams.attributes, assetType.attributeTypes);
  if (errors.length) {
    const error = new Error();
    error.attributes = errors;
    throw error;
  }
  return models.Asset.create(request.body)
}

async function getAssets() {
  return models.Asset.findAll();
}

async function getAsset(request) {
  return models.Asset.findById(request.params.id);
}

async function updateAsset(request) {
  const assetParams = request.body;
  const asset = await models.Asset.findById(request.params.id);
  Object.assign(asset, assetParams);
  const assetType = models.AssetType.findById(assetParams.assetTypeId);
  const errors = validateAttributes(assetParams.attributes, assetType.attributeTypes);
  if (errors.length) {
    const error = new Error();
    error.attributes = errors;
    throw error;
  }
  return assetParams.save();
}

async function deleteAsset(request) {
  const asset = await models.Asset.findById(request.params.id);
  return asset.destroy();
}

/**
 * Deep validation that asset.attributes match assetType.attributeTypes
 * Ex (valid):
 * attributes = {
 *   color: "red",
 *   size: 32
 * }
 * types = {
 *   color: {
 *     jstype: "" // string
 *   },
 *   size: {
 *     jstype: 0 // number
 *   },
 * }
 */
function validateAttributes(attributes, types) {
  const errors = [];
  for (const key in attributes) {
    const type = types[key].jstype;
    if (typeof attributes[key] !== typeof type) {
      errors.push({
        type: types[key],
        value: attributes[key]
      })
    }
  }
  return errors;
}

export {
  createAsset,
  getAssets,
  getAsset,
  updateAsset,
  deleteAsset
};
