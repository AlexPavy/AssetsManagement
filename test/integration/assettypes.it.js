const chai = require('chai');
const request = require('supertest');
const server = require('../../src/server');
const models = require('../../src/models/models');
const expect = chai.expect;

describe('/assettypes endpoint', () => {

  beforeEach(models.resetAll);

  it('should post', async () => {
    const assetTypeParams = {
      attributeTypes: {color: {jstype: ""}, size: {jstype: 0}}
    };
    const created = await request(server).post('/assetTypes').send(assetTypeParams);
    expect(!!parseInt(created.body.id)).to.be.true;
    expect(created.body).to.deep.include(assetTypeParams);
    const loadedAssetType = await models.AssetType.findById(created.body.id);
    expect(loadedAssetType.dataValues).to.deep.include(assetTypeParams);
  });

  it('should validate before post', async () => {
    const assetTypeParams = {
      attributeTypes: {color: {invalidKey: ""}, size: {jstype: 0}}
    };
    const created = await request(server).post('/assetTypes').send(assetTypeParams);
    expect(created.error.message).to.equal("cannot POST /assetTypes (400)");
    expect(created.body[0]).to.deep.include({
      "type": "color",
      "value": "Missing jstype"
    });
  });

});