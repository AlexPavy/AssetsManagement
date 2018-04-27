const chai = require('chai');
const request = require('supertest');
const server = require('../../src/server');
const models = require('../../src/models/models');
const expect = chai.expect;

describe('/users endpoint', () => {

  beforeEach(models.resetAll);

  it('should post', async () => {
    const userParams = {firstName: 'Gomez', lastName: 'Addams'};
    const created = await request(server).post('/users').set("x-api-key", "ky").send(userParams);
    expect(!!parseInt(created.body.id)).to.be.true;
    expect(created.body).to.deep.include(userParams);
    const loadedUser = await models.User.findById(created.body.id);
    expect(loadedUser.dataValues).to.deep.include(userParams);
  });

  it('should patch', async () => {
    const userParams = {firstName: 'Uncle Fester', lastName: 'Addams'};
    const updateUserParams = {firstName: 'Fester'};
    const patchedUserParams = {firstName: 'Fester', lastName: 'Addams'};
    const created = await models.User.create(userParams);
    const updated = await request(server).patch(`/users/${created.dataValues.id}`)
      .set("x-api-key", "ky").send(updateUserParams);
    expect(updated.body).to.deep.include(updateUserParams);
    const loadedUser = await models.User.findById(created.dataValues.id);
    expect(loadedUser.dataValues).to.deep.include(patchedUserParams);
  });

  it('should delete', async () => {
    const params = {firstName: 'Gomez', lastName: 'Addams'};
    const created = await models.User.create(params);
    await request(server).delete(`/users/${created.dataValues.id}`).set("x-api-key", "ky");
    const allUsers = await models.User.findAll();
    expect(allUsers.length).to.equal(0);
  });

  it('should get by id', async () => {
    const params = {firstName: 'Gomez', lastName: 'Addams'};
    const created = await models.User.create(params);
    const loadedUser = await request(server).get(`/users/${created.dataValues.id}`).set("x-api-key", "ky");
    expect(loadedUser.body).to.deep.include(params);
  });

  it('should get all', async () => {
    const params1 = {firstName: 'Gomez', lastName: 'Addams'};
    const params2 = {firstName: 'Morticia', lastName: 'Addams'};
    await request(server).post('/users').set("x-api-key", "ky").send(params1);
    await request(server).post('/users').set("x-api-key", "ky").send(params2);
    const allUsers = await request(server).get('/users').set("x-api-key", "ky");
    expect(allUsers.body.length).to.equal(2);
    expect(allUsers.body[0]).to.deep.include(params1);
    expect(allUsers.body[1]).to.deep.include(params2);
  });

});