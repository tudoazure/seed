"use strict";

ChatPanel.Views.MerchantSearchView = Backbone.View.extend({ 

	el : "",
	template : null,

	events : {
		'click #searchMerchant': 'searchMerchantByNameId',
		'click .viewCatalogLink' : 'openCatalogView',
		'click .viewOrderLink' : 'openOrderView'
	},

	initialize: function(options){
	  this.template = _.template( $('#merchantSearch-template').html());
      _.bindAll(this, 'render');
      // this.render();
	},

	render: function(options){
		this.tab= options.tab;
	  	this.$el.html( this.template({tabName: this.tab}));
	    this.delegateEvents(); 
	    return this;
  	},

  	getControl: function(selector){
  		return $(this.el).find(selector);
  	},

  	searchMerchantByNameId: function(event){
		var self = this;
		var serchValue = this.getControl('#merchantIdText').val();
		var url = constants.Url.MerchantList;
		if(serchValue){
			if(!isNaN(serchValue.trim())){
				url = url + '?merchant_id='+serchValue;
			}else{
				url = url + '?display_name='+serchValue;
			}
			utility.comn.showMask();
			$.ajax({
		      	url : url ,
		      	xhrFields: {withCredentials:true},
		      	success : function(data){
			        if(data && data.length){
			        	var merchantResp = [];
			        	$.each(data, function(i, v){
			        		var merchant = {};
			        		merchant.id = v.id;
			        		merchant.name = v.display_name;
			        		merchantResp.push(merchant);
			        	})
			           	self.renderCheckboxRowView(merchantResp, 'merchantTableBody');
			        }
			        utility.comn.hideMask();
		      	},
		      	error : function(data){
		      		utility.comn.hideMask();
		        	console.log('error in fetch merchant List API');
		      	}
		    })
	    }
	},

	renderCheckboxRowView: function(data, tableId){		
		this.getControl('#'+tableId).empty();
		var table = this.getControl('#'+tableId).closest('table');
		if(table && table.length){
			if(table.is(':hidden')){
				table.show();
			}
		}
		this.tableId = tableId;
	    if(data && data.length >0){
	      _.each(data, function(element, tableId){
	      	if(this.tab == "Catalog"){
	      		var template = _.template($('#catalogRow-template').html());
	      	}else{
	      		var template = _.template($('#orderRow-template').html());
	      	}	      	
	      	this.getControl('#'+this.tableId).append(template(element));    
	      } , this);
	    }
	},

	openCatalogView: function(event){
		var linkBtn = $(event.target);
		var merchantId = JSON.parse(linkBtn.attr('data-value')).id;
		var merchantName = JSON.parse(linkBtn.attr('data-value')).name;
		Backbone.trigger('openCatalogTabView', {merchantId:merchantId, merchantName : merchantName});
	},

	openOrderView: function(event){
		var linkBtn = $(event.target);
		var merchantId = JSON.parse(linkBtn.attr('data-value')).id;
		var merchantName = JSON.parse(linkBtn.attr('data-value')).name;
		Backbone.trigger('openOrderTabView', {merchantId:merchantId, merchantName : merchantName});
	}

});
