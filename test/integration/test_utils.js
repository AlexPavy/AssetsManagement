const request = require('supertest');
const server = require('../../src/server');

/** Authenticated request */
function getTestRequest() {
  return request(server).set("x-api-key", "ky");
}

module.exports = {
  request: getTestRequest
};