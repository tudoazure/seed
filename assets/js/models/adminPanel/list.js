"use strict";
    AdminPanel.Models.List = Backbone.Model.extend({
    	defaults: {
        id: "",
        name: "",
        image: "",
        productCount : "",
        createdDate: "",
        createdTime: "",
        lastModifiedDate: "",
        lastModifiedTime: "",
        desc : "",
        footerHtml : "",
        status: "",
        visibility: "",
        isUpdate: false
      }
    });

    AdminPanel.Collections.ListCollection = Backbone.Collection.extend({
        // Reference to this collection's model.
        model : AdminPanel.Models.List,     
        parse: function(data) {
          var response = [];
          if(data && data.result && data.result.length > 0){
            $.each(data.result, function(i, v){
              var list = {};
              list.id = v.id || "";
              list.name = v.name || "";
              list.image = v.image || "";
              list.productCount = v.count || "0";
              list.createdDate = utility.comn.parseDate(v.created_at || "");
              list.createdTime = utility.comn.parseTime(v.created_at || "");
              list.lastModifiedDate = utility.comn.parseDate(v.updated_at || "");
              list.lastModifiedTime = utility.comn.parseTime(v.updated_at || "");
              list.desc = v.description || "";
              list.footerHtml = v.info ? (JSON.parse(v.info).footer_html || "") : "";
              list.status = v.status || "";
              list.visibility = v.visibility || "";
              response.push(list);
            });
          }
          return response;
        }
      });