const chai = require('chai');
const request = require('supertest');
const server = require('../../src/server');
const models = require('../../src/models/models');
const userService = require('../../src/service/user_service');
const assetService = require('../../src/service/asset_service');
const assetTypeService = require('../../src/service/assettype_service');
const expect = chai.expect;

describe('/assets endpoint', () => {

  let assetType, user, user2, asset, asset2;
  beforeEach(async () => {
    await models.resetAll();
    user = (await userService.createUser({body: {firstName: "Gomez"}})).dataValues;
    user2 = (await userService.createUser({body: {firstName: "Morticia"}})).dataValues;
    const assetTypeParams = {
      name: "With color and size",
      attributeTypes: {color: {jstype: ""}, size: {jstype: 0}}
    };
    assetType = (await assetTypeService.createAssetType({body: assetTypeParams})).dataValues;
    const assetParams = {
      AssetTypeId: assetType.id,
      assetAttributes: {color: "red"}
    };
    asset = (await assetService.createAsset({body: assetParams})).dataValues;
    const assetParams2 = {
      AssetTypeId: assetType.id,
      assetAttributes: {color: "green"}
    };
    asset2 = (await assetService.createAsset({body: assetParams2})).dataValues;
  });

  it('should post', async () => {
    const allocation = {
      AssetId: asset.id,
      UserId: user.id,
      startDate: "2018-04-26T23:30:55.000Z",
      endDate: "2018-04-28T23:30:55.000Z"
    };
    const created = await request(server).post('/allocations').send(allocation);
    expect(!!parseInt(created.body.id)).to.be.true;
    expect(created.body).to.deep.include(allocation);
    const loadedAllocation = await models.Allocation.findById(created.body.id);
    expect(loadedAllocation.dataValues).to.deep.include({
      AssetId: allocation.AssetId,
      UserId: allocation.UserId,
      startDate: new Date(allocation.startDate),
      endDate: new Date(allocation.endDate),
    });
  });

  it('should validate asset exists before post', async () => {
    const allocation = {
      AssetId: "99997",
      UserId: user.id,
      startDate: "2018-04-26T23:30:55.000Z",
      endDate: "2018-04-28T23:30:55.000Z"
    };
    const result = await request(server).post('/allocations').send(allocation);
    expect(result.error.message).to.equal("cannot POST /allocations (400)");
    expect(result.body[0]).to.deep.include({
      "type": "AssetId",
      "value": "99997"
    });
  });

  it('should validate user exists before post', async () => {
    const allocation = {
      AssetId: asset.id,
      UserId: "99998",
      startDate: "2018-04-26T23:30:55.000Z",
      endDate: "2018-04-28T23:30:55.000Z"
    };
    const result = await request(server).post('/allocations').send(allocation);
    expect(result.error.message).to.equal("cannot POST /allocations (400)");
    expect(result.body[0]).to.deep.include({
      "type": "UserId",
      "value": "99998"
    });
  });

  it('should validate date interval is positive before post', async () => {
    const allocation = {
      AssetId: asset.id,
      UserId: "99998",
      startDate: "2018-04-28T23:30:55.000Z",
      endDate: "2018-04-26T23:30:55.000Z"
    };
    const result = await request(server).post('/allocations').send(allocation);
    expect(result.error.message).to.equal("cannot POST /allocations (400)");
    expect(result.body.length).to.equal(2);
    expect(result.body[0]).to.deep.include({
      "type": "Date",
      "value": "Allocation duration is negative"
    });
  });

  it('should validate asset is available before post', async () => {
    const allocation1 = {
      AssetId: asset.id,
      UserId: user.id,
      startDate: "2018-04-26T23:30:55.000Z",
      endDate: "2018-04-28T23:30:55.000Z"
    };
    const allocation1Created = await request(server).post('/allocations').send(allocation1);
    const allocation2 = {
      AssetId: asset.id,
      UserId: user2.id,
      startDate: "2018-04-27T23:30:55.000Z",
      endDate: "2018-04-29T23:30:55.000Z"
    };
    const result = await request(server).post('/allocations').send(allocation2);
    expect(result.error.message).to.equal("cannot POST /allocations (400)");
    expect(result.body[0]).to.deep.include({
      "type": "Date",
      "value": `Asset allocation ${allocation1Created.body.id} overlap`
    });
  });

  it('should get by query user id', async () => {
    await models.Allocation.create({
      AssetId: asset.id,
      UserId: user.id,
      startDate: "2018-04-26T23:30:55.000Z",
      endDate: "2018-04-28T23:30:55.000Z"
    });
    await models.Allocation.create({
      AssetId: asset.id,
      UserId: user2.id,
      startDate: "2018-04-26T23:30:55.000Z",
      endDate: "2018-04-28T23:30:55.000Z"
    });
    const allAllocations = await request(server).get(`/allocations`);
    expect(allAllocations.body.length).to.equal(2);
    const allocationsOfUser1 = await request(server).get(`/allocations?UserId=${user.id}`);
    expect(allocationsOfUser1.body.length).to.equal(1);
    expect(allocationsOfUser1.body[0].UserId).to.equal(user.id);
  });

  it('should get by query asset id', async () => {
    await models.Allocation.create({
      AssetId: asset.id,
      UserId: user.id,
      startDate: "2018-04-26T23:30:55.000Z",
      endDate: "2018-04-28T23:30:55.000Z"
    });
    await models.Allocation.create({
      AssetId: asset2.id,
      UserId: user.id,
      startDate: "2018-04-26T23:30:55.000Z",
      endDate: "2018-04-28T23:30:55.000Z"
    });
    const allAllocations = await request(server).get(`/allocations`);
    expect(allAllocations.body.length).to.equal(2);
    const allocationsOfAsset2 = await request(server).get(`/allocations?AssetId=${asset2.id}`);
    expect(allocationsOfAsset2.body.length).to.equal(1);
    expect(allocationsOfAsset2.body[0].AssetId).to.equal(asset2.id);
  });

  it('should get current allocations', async () => {
    await models.Allocation.create({
      AssetId: asset.id,
      UserId: user.id,
      startDate: "2018-04-22T23:30:55.000Z",
      endDate: "2018-04-24T23:30:55.000Z"
    });
    const tomorrow = new Date();
    tomorrow.setDate(new Date().getDate()+1);
    await models.Allocation.create({
      AssetId: asset2.id,
      UserId: user.id,
      startDate: "2018-04-26T23:30:55.000Z",
      endDate: tomorrow,
    });
    const allAllocations = await request(server).get(`/allocations`);
    expect(allAllocations.body.length).to.equal(2);
    const currentAllocations = await request(server).get(`/allocations?current=true`);
    expect(currentAllocations.body.length).to.equal(1);
    expect(currentAllocations.body[0].AssetId).to.equal(asset2.id);
  });

  it('should get current allocations for user 1', async () => {
    await models.Allocation.create({
      AssetId: asset.id,
      UserId: user.id,
      startDate: "2018-04-22T23:30:55.000Z",
      endDate: "2018-04-24T23:30:55.000Z"
    });
    const tomorrow = new Date();
    tomorrow.setDate(new Date().getDate()+1);
    await models.Allocation.create({
      AssetId: asset2.id,
      UserId: user.id,
      startDate: "2018-04-26T23:30:55.000Z",
      endDate: tomorrow,
    });
    await models.Allocation.create({
      AssetId: asset2.id,
      UserId: user2.id,
      startDate: "2018-04-26T23:30:55.000Z",
      endDate: tomorrow,
    });
    const currentAllocations = await request(server).get(`/allocations?current=true`);
    expect(currentAllocations.body.length).to.equal(2);
    const currentAllocationsForUser = await request(server).get(`/allocations?current=true&UserId=${user.id}`);
    expect(currentAllocationsForUser.body.length).to.equal(1);
    expect(currentAllocationsForUser.body[0].AssetId).to.equal(asset2.id);
    expect(currentAllocationsForUser.body[0].UserId).to.equal(user.id);
  });

});