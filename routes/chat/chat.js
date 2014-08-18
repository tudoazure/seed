"use strict";
var SERVER = require('../lib/oauth').SERVER;

var chat = {
  /* Default handler for / page */
  index : function(req, res, next) {
    var view ='chat/index';
    var renderData = {};
    var user = {};
    if(!req.session.user) {
      view = 'login/index';
    }
    else{
       if(req.session.user){
        if(req.session.user.username && req.session.user.username != ""){
          user.name = req.session.user.username;
        }
        else{
          user.name = req.session.user.email;
        }
        user.email = req.session.user.email;
        user.mobile = req.session.user.mobile;
        user.token = req.session.user.token;
        user.type = req.session.user.type;
      }
    }
    
    renderData.user = user;
    renderData.fulfillementHost = SERVER.FULFILLMENT + '/v1/';
    renderData.chatHost = SERVER.CHATHOST;
    renderData.webHost = SERVER.SELF;
    renderData.catalogHost = SERVER.CATALOG;
    res.render(view, renderData);
  }
};

module.exports = chat;
