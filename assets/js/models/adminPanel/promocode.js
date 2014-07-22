"use strict";

AdminPanel.Models.Promocode = Backbone.Model.extend({

	defaults: {
    id:"",
    code:"",
    campaign:"",
    type:"",
    startDate:"",
    startTime: "",
    endDate:"",
    endTime: "",
    status:"",
    description: "",
    merchantId : "",
    redemptionType: "", 
  }

});

AdminPanel.Collections.PromocodeCollection = Backbone.Collection.extend({

	 model : AdminPanel.Models.Promocode, 

	 parse: function(promoResponse){
	 	var response = [];
	 	if(promoResponse){
      $.each(promoResponse, function(i, v){
        var promo = {};
        promo.id = v.id || "";
        promo.code = v.code || "";
        promo.campaign = v.campaign || "";
        promo.type = v.promo_type || "";
        promo.startDate = utility.comn.parseDate(v.valid_from || "");
        promo.startTime = utility.comn.parseTime(v.valid_from || "");
        promo.endDate = utility.comn.parseDate(v.valid_upto || "");
        promo.endTime = utility.comn.parseTime(v.valid_upto || "");
        promo.status = enums.promoStatus[v.is_enabled || ""];
        promo.description = v.description || "";
        promo.merchantId = v.merchant_id || "";
        promo.redemptionType = enums.promocodeType[v.redemption_type || ""];
        response.push(promo);
      });

	 	}
	 	return response;
	 }

});