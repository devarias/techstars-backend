const request = require('supertest')('https://techstars-api.herokuapp.com/api');
const expect = require('chai').expect;
//Factory design pattern
module.exports = {
  request,
  expect,
};
