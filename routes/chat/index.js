"use strict";

var oauth = require('../lib/oauth');
var chat = require('./chat');

module.exports = function (app) {
  app.get('/', chat.index);
  app.get('/chat', chat.index);
  app.get('/userDetail', oauth.getUserDetails);
};
