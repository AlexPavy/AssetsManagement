const express = require('express');
const userService = require('./service/user_service');
const assetTypeService = require('./service/assettype_service');
const assetService = require('./service/asset_service');
const allocationService = require('./service/allocation_service');
const configurations = require('../config/configurations');

const router = express.Router();
router
  .route('/users')
  .get((req, res) => apiMethodWrapper(userService.getUsers, req, res))
  .post((req, res) => apiMethodWrapper(userService.createUser, req, res));
router
  .route('/users/:id')
  .get((req, res) => apiMethodWrapper(userService.getUser, req, res))
  .patch((req, res) => apiMethodWrapper(userService.updateUser, req, res))
  .delete((req, res) => apiMethodWrapper(userService.deleteUser, req, res));
router
  .route('/assettypes')
  .get((req, res) => apiMethodWrapper(assetTypeService.getAssetTypes, req, res))
  .post((req, res) => apiMethodWrapper(assetTypeService.createAssetType, req, res));
router
  .route('/assettypes/:id')
  .get((req, res) => apiMethodWrapper(assetTypeService.getAssetType, req, res))
  .patch((req, res) => apiMethodWrapper(assetTypeService.updateAssetType, req, res))
  .delete((req, res) => apiMethodWrapper(assetTypeService.deleteAssetType, req, res));
router
  .route('/assets')
  .get((req, res) => apiMethodWrapper(assetService.getAssets, req, res))
  .post((req, res) => apiMethodWrapper(assetService.createAsset, req, res));
router
  .route('/assets/:id')
  .get((req, res) => apiMethodWrapper(assetService.getAsset, req, res))
  .patch((req, res) => apiMethodWrapper(assetService.updateAsset, req, res))
  .delete((req, res) => apiMethodWrapper(assetService.deleteAsset, req, res));
router
  .route('/allocations')
  .get((req, res) => apiMethodWrapper(allocationService.getAllocations, req, res))
  .post((req, res) => apiMethodWrapper(allocationService.createAllocation, req, res));
router
  .route('/allocations/:id')
  .get((req, res) => apiMethodWrapper(allocationService.getAllocation, req, res))
  .patch((req, res) => apiMethodWrapper(allocationService.updateAllocation, req, res))
  .delete((req, res) => apiMethodWrapper(allocationService.deleteAllocation, req, res));

function apiMethodWrapper(routeMethod, request, response) {
  if (!checkHasApiKey(request)) {
    response.status(401);
    response.send({
      type: 'API key',
      value: 'Invalid',
    });
    return;
  }

  return routeMethod(request)
    .then(res => response.send(res))
    .catch(e => {
      if (e.attributes) {
        response.status(400);
        response.send(e.attributes);
      } else {
        response.status(500);
        response.send(e.message);
      }
    });
}

function checkHasApiKey(request) {
  if (!request.headers["x-api-key"]) return false;
  if (!configurations.getApiKeys().includes(request.headers["x-api-key"])) return false;
  return true;
}

module.exports = router;