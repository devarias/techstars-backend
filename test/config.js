const request = require('supertest')('https://techstars-api.herokuapp.com/api');
const expect = require('chai').expect;

module.exports = {
  request,
  expect,
};
