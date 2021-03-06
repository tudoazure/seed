"use strict";

var request = require('request');
var config = require('../../environment');
var oauth = require('market-oauth');
var auth = oauth.auth;
var user = require('market-oauth/user');

var SERVER = {

  SELF: config.host,
  OAUTH: config.oauth.baseUrl, //http://10.0.20.55',
  FULFILLMENT: config.fulfillment.host,
  CHATHOST: config.chatServer.host,
  DOMAIN: config.domain,
  CATALOG : config.catalog
};

var COOKIE = 'ff.sid';

var options = config.oauth;

var oauth = {

  SERVER: SERVER,

  isLogin: function(req, res, next) {

    if ((['/', '/chat', '/logout', '/userDetail', '/authorize', '/token'].indexOf(req.path) > -1) || (req.session && req.session.user && req.session.user && req.session.user.activeMerchant)) {
      return next();
    }

    //res.redirect('/home');
  },

  authorize: function(req, res, next) {

    if (req.session && req.session.user && req.session.user.token) {
      return next();
    }

    if (req.query.code) {
      return next();
    }

    var redirect_url;
    redirect_url = auth.getAuthURL({
      redirect_uri: SERVER.SELF + '/token'
    });
    //console.log('redirecting to ' + redirect_url);
    res.redirect(redirect_url);

  },

  getToken: function(req, res, next) {

    var code;
    var redirect_url
    if (req.query.code) {
      code = req.query.code;
    } else {
      return res.send(401);
    }
    auth.exchangeCodeForToken(code, function(err, access) {
      if (err || !access) {
        redirect_url = auth.getAuthURL({
          redirect_uri: SERVER.SELF + '/token'
        });
        //console.log('redirecting to ' + redirect_url);
        return res.redirect(redirect_url);
      }
      req.session.user = {};
      req.session.user.token = access.access_token;
      next();
    })
  },

  getUserDetails: function(req, res, next) {

    var token = req.session.user.token;
    user.fastfetch(token, function(err, result) {
      if (err) {
        res.send(401, {
          'error': 'OAuth authentication failure'
        });
      } else {
        res.send(200, result);
      }
    });
  },

  authorizeMerchant: function(req, res, next) {

    var token = req.session.user.token;
    request.get({
        url: SERVER.FULFILLMENT + '/authorize?token=' + token,
        json: true
      }, function(err, resp, body) {
        if (err || resp.statusCode != 200) {
          return next(err || new Error('Unauthorized Access'));
        }

        var cookiename = '';
        if (resp.headers['set-cookie'] && resp.headers['set-cookie'].length) {
          cookiename = resp.headers['set-cookie'][0].split(COOKIE + '=')[1];
          cookiename = cookiename.split(';')[0];
        }
      cookiename = decodeURIComponent(cookiename);
      res.cookie(COOKIE, cookiename, {
        domain: '.paytm.com',
        path: '/',
        httpOnly: true
      });
      if (body.admin) {
        var token = req.session.user.token;
        req.session.user = body.admin;
        req.session.user.token = token;
        if (SERVER.DOMAIN == 'bargain') {
          res.redirect('/');
          req.session.user.domain = 'bargain';
        } else {
          res.end('Not bargain server');
        }
      } else {
        res.end('Not an admin');
      }

    });
  },

  logout: function(req, res, next) {
    var fulfillment_cookie = req.cookies[COOKIE];
    var jar = request.jar();
    var cookie = request.cookie(COOKIE + '=' + fulfillment_cookie);
    jar.setCookie(cookie, '.paytm.com', function(error, cookie) {});
    request.get({
      url: SERVER.FULFILLMENT + '/logout',
      jar: jar
    }, function(err, resp, body) {
      req.session.destroy(function() {
        res.clearCookie(COOKIE);
        res.redirect('/');
      });

    });
  }
};

module.exports = oauth;
