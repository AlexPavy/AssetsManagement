const models = require('../models/models');

async function createAsset(request) {
  const assetParams = request.body;
  validateAsset(assetParams);
  return models.Asset.create(assetParams)
}

async function updateAsset(request) {
  const assetParams = request.body;
  const asset = await models.Asset.findById(request.params.id);
  Object.assign(asset, assetParams);
  validateAsset(assetParams);
  return assetParams.save();
}

async function deleteAsset(request) {
  const asset = await models.Asset.findById(request.params.id);
  return asset.destroy();
}

async function getAssets() {
  return models.Asset.findAll();
}

async function getAsset(request) {
  return models.Asset.findById(request.params.id);
}

function validateAsset(asset) {
  const assetType = models.AssetType.findById(asset.assetTypeId);
  const errors = checkAttributes(asset.assetAttributes, assetType.attributeTypes);
  if (errors.length) {
    const error = new Error();
    error.attributes = errors;
    throw error;
  }
}

/**
 * Deep validation that asset.assetAttributes match assetType.attributeTypes
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
function checkAttributes(attributes, types) {
  const errors = [];
  for (const key in attributes) {
    const type = types[key].jstype;
    if (typeof attributes[key] !== typeof type) {
      errors.push({
        type: `${key}: ${JSON.stringify(types[key])}`,
        value: attributes[key]
      });
    }
  }
  return errors;
}

module.exports = {
  createAsset,
  updateAsset,
  deleteAsset,
  getAssets,
  getAsset,
};
