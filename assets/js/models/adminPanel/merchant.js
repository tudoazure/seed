"use strict";
 // (function () {
    AdminPanel.Models.Merchant = Backbone.Model.extend({
    	defaults: {
        id:"",
        name:"",
        displayName:"",
        companyName:"",
        email:"",
        mobile:"",
        landline:"",
        companyLogo:"",
        shipping:"",
        commission:"",
        createdDate:"",
        createdTime:"",
        lastModifiedDate:"",
        lastModifiedTime:"",  
        primaryContactName:"",
        primaryContactEmail:"",
        primaryContactMobile:"",
        altContactName:"",
        altContactEmail:"",
        altContactMobile:"",
        status:"",
        info:"",
      }
    });

    AdminPanel.Collections.MerchantCollection = Backbone.Collection.extend({
        // Reference to this collection's model.
        model : AdminPanel.Models.Merchant,     
        parse: function(merchantResponse) {
          var response = [];
          if(merchantResponse){
            $.each(merchantResponse, function(i, v){
              var merchant = {};
              merchant.id = v.id || "";
              merchant.name = v.name || "";
              merchant.displayName = v.display_name || "";
              merchant.companyName = v.company_name || "";
              merchant.email = v.email_id || "";
              merchant.mobile = v.mobile_no || "";
              merchant.landline = v.landline_no || "";
              merchant.companyLogo = v.company_logo_path || "";
              merchant.shipping = v.max_shipping_days || "";
              merchant.commission = v.pg_commission || "";
              merchant.createdDate = utility.comn.parseDate(v.created_at || "");
              merchant.createdTime = utility.comn.parseTime(v.created_at || "");
              merchant.lastModifiedDate = utility.comn.parseDate(v.updated_at || "");
              merchant.lastModifiedTime = utility.comn.parseTime(v.updated_at || "");
              merchant.primaryContactName = v.am_name || "";
              merchant.primaryContactEmail = v.am_email_id || "";
              merchant.primaryContactMobile = v.am_mobile_no || "";
              merchant.altContactName = v.am_name || "";
              merchant.altContactEmail = v.am_email_id || "";
              merchant.altContactMobile = v.am_mobile_no || "";
              merchant.status = v.status || "";
              merchant.info = v.info || "";
              response.push(merchant);
            });
          }
          return response;
        }
      });
//}());