"use strict";

var oauth = require('./../lib/oauth');
var oauthcfg = require('../../environment').oauth;
var chat = require('./chat');

module.exports = function (app) {
  require('market-oauth').configure(oauthcfg);
  app.get('/', chat.index);
  app.get('/userDetail', oauth.getUserDetails);
  app.get('/authorize', oauth.authorize);
  app.get('/token', oauth.getToken, oauth.authorizeMerchant);
  app.get('/logout', oauth.logout);
};