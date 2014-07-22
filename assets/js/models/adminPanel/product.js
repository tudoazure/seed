"use strict";
 (function () {
AdminPanel.Models.ProductGrid = Backbone.Model.extend({
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
    vertical: "",
    is_in_stock : "",
    manage_stock: "" //0 for unmanaged 1 = managed
  }
});

AdminPanel.Collections.ProductGridCollection = Backbone.Collection.extend({
    // Reference to this collection's model.
    model : AdminPanel.Models.ProductGrid,
    
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
            product.is_in_stock = enums.productInStockStatus[productData.is_in_stock|| 0 ];
            product.manage_stock = productData.manage_stock;
            response.push(product);     
          });
        }
        return response;
      }
  });

}());