"use strict";
  AdminPanel.Models.AppView = Backbone.Model.extend({
  	defaults: {
      id: "",
      name: "",
      layout: "",
      items: []
    }
  });

  AdminPanel.Collections.AppViewCollection = Backbone.Collection.extend({
      model : AdminPanel.Models.AppView,     
      parse: function(appViewResponse) {
        var response = [];
        if(appViewResponse && appViewResponse.homepage_layout){
          $.each(appViewResponse.homepage_layout, function(i, v){
            if(v.layout != "html"){
              var appView = {};
              appView.id = v.id || "";
              appView.name = v.name || "";
              appView.layout = v.layout || "";
              appView.items = v.items || "";
              response.push(appView);
            }
          });
        }
        return response;
      }
    });
