const chai = require('chai');
const request = require('supertest');
const server = require('../../src/server');
const models = require('../../src/models/models');
const assetTypeService = require('../../src/service/assettype_service');
const expect = chai.expect;

describe('/assets endpoint', () => {

  let assetType;
  beforeEach(async () => {
    await models.resetAll();
    const assetTypeParams = {
      name: "With color and size",
      attributeTypes: {color: {jstype: ""}, size: {jstype: 0}}
    };
    assetType = (await assetTypeService.createAssetType({ body: assetTypeParams })).dataValues;
  });

  it('should post', async () => {
    const assetParams = {
      AssetTypeId: assetType.id,
      assetAttributes: {color: "blue"},
    };
    const created = await request(server).post('/assets').send(assetParams);
    expect(!!parseInt(created.body.id)).to.be.true;
    expect(created.body).to.deep.include(assetParams);
    const loadedAsset = await models.Asset.findById(created.body.id);
    expect(loadedAsset.dataValues).to.deep.include(assetParams);
  });

  it('should validate asset type exists before post', async () => {
    const assetParams = {
      AssetTypeId: '99999',
      assetAttributes: {color: "blue"},
    };
    const result = await request(server).post('/assets').send(assetParams);
    expect(result.error.message).to.equal("cannot POST /assets (400)");
    expect(result.body[0]).to.deep.include({
      "type": "AssetTypeId",
      "value": "99999"
    });
  });

  it('should validate asset type matches before post', async () => {
    const assetParams = {
      AssetTypeId: assetType.id,
      assetAttributes: {color: 22},
    };
    const result = await request(server).post('/assets').send(assetParams);
    expect(result.error.message).to.equal("cannot POST /assets (400)");
    expect(result.body[0]).to.deep.include({
      "type": "color: {\"jstype\":\"\"}",
      "value": 22
    });
  });

});