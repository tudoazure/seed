"use strict";

var util = require('util');
var csv = require('ya-csv');

var SERVER = require('../../lib/oauth').SERVER;

var chat = {
  /* Default handler for / page */
  index : function(req, res, next) {
  	var renderData = {};
    renderData.metainfo = {
      "title": "",
      "keywords": "",
      "description": ""
    };

    var view;
    var user = {};
    user.userId = "";
    user.loginName = "";
    renderData.auth_info = req.auth_info;

    view = 'chatPanel/index';
    if(!req.session.user) {
      view = 'login/index';
    }
    else{
       if(req.session.user){
        if(req.session.user.username && req.session.user.username != ""){
          user.loginName = req.session.user.username;
        }
        else{
          user.loginName = req.session.user.email;
        }
        user.email = req.session.user.email;
        user.mobile = req.session.user.mobile;
        user.token = req.session.user.token;
        user.type = req.session.user.type;
        user.apiUrl = SERVER.FULFILLMENT + '/v1/';
      }
      if(req.session.user.domain == 'admin'){
        view = 'adminPanel/index';
      }
      else if (req.session.user.domain == 'bargain'){
        view = 'chatPanel/index';
      }
      else if (req.session.user.domain == 'merchant'){
        view = 'merchantPanel/index';
      }
    }

    renderData.user = user;
    res.render(view, renderData);
  }
};

module.exports = chat;
