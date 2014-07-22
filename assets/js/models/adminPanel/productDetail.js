"use strict";
 (function () {
ChatPanel.Models.ProductDetail = Backbone.Model.extend({
	defaults: {
    id: "",
    paytmSkuId:"",
    merchantSkuId:"",
    name:"",
    mrp:"",
    actualPrice:"",
    diacountMsg: "",
    brand:"",
    size: "",
    color: "",
    ocasion: "",
    shortDesc: "",
    description : "",
    status:"",
    inventoryManagedBy:"",
    stock: "",
    shipDays: "",
    returnDays: "",
    resources: "",
    visibility:"",
    categoryPath : "",
    attributes: "",
    quantity : "",
    vertical_id : "",
    categoryId: "",
    tag: "",
    variants : ""
  },

  parse: function(response){
    var product= {};
    if(response)
    product.id = response.id || 0;
    product.paytmSkuId = response.paytm_sku || 0;
    product.merchantSkuId = response.sku || 0;
    product.name = response.name || "";
    product.mrp = response.mrp || 0;
    product.sellingPrice = response.price || 0;
    product.promoText = response.promo_text || "";
    product.attributes = [];
    product.categoryPath = "";
    product.imageSrc = response.thumbnail; 
    product.categoryId = response.category_id ||0;
    product.tag = response.tag || "None";
    product.variants = response.variants;
    product.attributes.push({name:"brand", value:response.brand });
    if(response.attributes){
        $.each(response.attributes, function(i, value){
            if(i != 'id' && i != 'product_id'){
                var attr = {};
                attr.name = i;
                attr.value = value;
                // attr[i] = value;
                product.attributes.push(attr);
            }
        });
    }
    product.shortDesc = response.short_description || "";
    product.description = [];
    if(response.description){
        var productDescCollection= JSON.parse(response.description); //response.description;//response.description[0]; //JSON.parse(response.description);
        if(productDescCollection ){
            $.each(productDescCollection, function(i, description){
                var desc = {};
                desc.title = description.title;
                desc.description = description.description;
                var attr1 = description.attributes ;//{color: "red", size: "XXL"};
                desc.attributes = [];
                $.each(attr1, function(i, attr){
                    var attribute = {};
                    attribute.name = i;
                    attribute.value = attr;
                    // attribute[i]  = attr;
                    desc.attributes.push(attribute);
                })

                product.description.push(desc);
            })
        }
    }
    product.status = enums.productStatus[response.status || 0]; 
    product.inventoryManagedBy= enums.productInventory[response.manage_stock || 0];
    product.quantity = response.inventory ? response.inventory.qty : 0;
    product.shipDays  = response.max_dispatch_time || 0;
    product.returnDays = response.return_in_days || 0;
    product.resources = [];
    if(response.resource && response.resource.length){
        $.each(response.resource, function(i, resp){
            var resource = {};
            var pathArray = resp.value.split('/');
            resource.id = resp.id;
            resource.value = resp.value;
            resource.name = pathArray[pathArray.length -1];
            resource.type = resp.type;
            resource.is_default = resp.is_default;
            resource.status = resp.status;
            resource.resolution = resp.resolution;
            product.resources.push(resource);
        })
    }
    
    product.visibility = response.visibility;
    product.vertical_id = response.vertical_id;
    return product;
  }
});



}());