"use strict";
 (function () {
CSTPanel.Models.Order = Backbone.Model.extend({
	defaults: {
    orderId:"",
    customerName:"",
    createdDate:"",
    createdTime:"",
    shippingDays:"",
    finalPrice: "",
    status:"",
    shippingAddress1:"",
    shippingAddress2:"",
    shippingAddress3:"",
    items:[]
  }
});

CSTPanel.Collections.OrderCollection = Backbone.Collection.extend({
    // Reference to this collection's model.
    model : CSTPanel.Models.Order,
    
    // url: 'http://fulfillment-dev.paytm.com/v1/merchant/1/orders.json',
    
    parse: function(merchantOrderResponse) {
      var response = [];
      if(merchantOrderResponse){
        $.each(merchantOrderResponse, function(i, orderData){
          var merchant= {}; var showOrderEWB = false;
          // merchant.id = orderData.id || 0;
          merchant.customerName = (orderData.customer_firstname || "")+' ' + (orderData.customer_lastname || "");
        
          merchant.createdDate = utility.comn.parseDate(orderData.created_at || "");
          merchant.createdTime = utility.comn.parseTime(orderData.created_at || "");
          merchant.status = enums.orderItemStatus[orderData.status || 1];
          merchant.orderId = orderData.id || 0;
          merchant.price = orderData.price || 0;
          merchant.shippingDays = utility.comn.daydiff(new Date(), new Date(orderData.ship_by_date));
          merchant.paymentStatus = enums.paymentStatus[orderData.payment_status || 1];

          if(orderData.address && orderData.address.length >0){
            merchant.shippingAddress1 = orderData.address[0].address ;
            merchant.shippingAddress2 = orderData.address[0].city;
            merchant.shippingAddress3 = orderData.address[0].state +','+ orderData.address[0].country +' '+ orderData.address[0].pincode;
          }

          if(orderData.items && orderData.items.length > 0 ){
            merchant.items = [];
            $.each(orderData.items, function(i, item){
              var merchantItem = {};
              merchantItem.orderId = merchant.orderId;
              merchantItem.id  = item.id;
              merchantItem.merchantId = item.merchant_id;
              merchantItem.skuId = item.sku;
              merchantItem.mrp = item.mrp;
              merchantItem.price = item.price;
              merchantItem.ackDate = utility.comn.parseDate(item.ack_by || "");
              merchantItem.shipDate = utility.comn.parseDate(item.ship_by_date || "");
              merchantItem.qty = item.qty_ordered;
              merchantItem.status = enums.orderItemStatus[item.status || 1];
              if(item.status == 3){
                showOrderEWB = true;
              }
              merchantItem.name = item.name || "";
              merchantItem.verticalId = item.vertical_id;
              merchantItem.createdDate = utility.comn.parseDate(item.created_at || "");
              merchantItem.fulfillmentId = item.fulfillment_id || "";
              merchant.items.push(merchantItem);
            });

          }
          merchant.showEWB = showOrderEWB;
          
          response.push(merchant);
        });

      }
      return response;
    }
  });

}());