"use strict";
    AdminPanel.Models.Courier = Backbone.Model.extend({
    	defaults: {
        id: "",
        name: "",
        trackingUrl : "",
        status: "",
        createdDate: "",
        createdTime: "",
        lastModifiedDate: "",
        lastModifiedTime: ""
      }
    });

    AdminPanel.Collections.CourierCollection = Backbone.Collection.extend({
        // Reference to this collection's model.
        model : AdminPanel.Models.Courier,     
        parse: function(data) {
          var response = [];
          if(data && data && data.length > 0){
            $.each(data, function(i, v){
              var shipper = {};
              shipper.id = v.id || "";
              shipper.name = v.name || "";
              shipper.trackingUrl = v.url || "";
              shipper.status = enums.courierStatus[v.status || ""];
              shipper.createdDate = utility.comn.parseDate(v.created_at || "");
              shipper.createdTime = utility.comn.parseTime(v.created_at || "");
              shipper.lastModifiedDate = utility.comn.parseDate(v.updated_at || "");
              shipper.lastModifiedTime = utility.comn.parseTime(v.updated_at || "");
              response.push(shipper);
            });
          }
          return response;
        }
      });