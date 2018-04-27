const chai = require('chai');
const request = require('supertest');
const server = require('../../src/server');
const models = require('../../src/models/models');
const sinon = require('sinon');
const expect = chai.expect;

describe('router', () => {

  const sandbox = sinon.createSandbox();
  beforeEach(models.resetAll);
  afterEach(() => {
    sandbox.restore();
  });

  it('should reply 500 in case there is a database error', async () => {
    sandbox.stub(models.AssetType, 'create').callsFake(() => {
      throw new Error();
    });
    const assetTypeParams = {
      attributeTypes: {size: {jstype: 0}}
    };
    const created = await request(server).post('/assetTypes').set("x-api-key", "ky").send(assetTypeParams);
    expect(created.error.message).to.equal("cannot POST /assetTypes (500)");
  });

  it('should reply 401 in case the x-api-key is missing', async () => {
    sandbox.stub(models.AssetType, 'create').callsFake(() => {
      throw new Error();
    });
    const assetTypeParams = {
      attributeTypes: {size: {jstype: 0}}
    };
    const created = await request(server).post('/assetTypes').set("x-api-key", "invalid").send(assetTypeParams);
    expect(created.error.message).to.equal("cannot POST /assetTypes (401)");
  });

});