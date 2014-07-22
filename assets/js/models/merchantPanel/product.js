"use strict";
 (function () {
MerchantPanel.Models.ProductGrid = Backbone.Model.extend({
	defaults: {
    id:"",
    skuId:"",
    name:"",
    mrp:"",
    actualPrice:"",
    finalPrice: "",
    status:"",
    inventory:"",
    visibility:"",
    vertical: ""
  }
});

MerchantPanel.Collections.ProductGridCollection = Backbone.Collection.extend({
    // Reference to this collection's model.
    model : MerchantPanel.Models.ProductGrid,
    
    // url: 'http://fulfillment-dev.paytm.com/v1/merchant/1/orders.json',
    
    parse: function(gridResponse) {
      var response = [];
      if(gridResponse){
        $.each(gridResponse, function(i, productData){
          var product= {}; var showOrderEWB = false;
            product.id = (productData.id || 0);        
            product.skuId = productData.sku;
            product.name = productData.name;
            product.status = enums.productStatus[productData.status || 0];
            product.mrp = productData.mrp || 0;
            product.actualPrice = productData.price || 0;
            product.inventory = enums.productInventory[productData.manage_stock || 0];
            product.visibility = productData.visibility;    
            product.vertical = productData.vertical_id || 2;
            response.push(product);     
          });
        }
        return response;
      }
  });

}());