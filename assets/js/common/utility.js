"use strict";

var utility = utility || {};
//function to replace multple string in javascript 
String.prototype.format = function (hash) {
        var string = this, key; for (key in hash) string = string.replace(new RegExp('\\{' + key + '\\}', 'gm'), hash[key]); return string
};

//function to compare two array
Array.prototype.compare = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].compare(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
};

utility.comn = {

	//Parsedate to format 26 Aug 2013 05:14
	parseDateTime : function(dateString){
		var parseDate = new Date();
		if(dateString){
			var date = new Date (dateString);
			var momentDate = moment(dateString);
			parseDate = momentDate.format("DD/MM/YYYY hh:mm A");

		}
		return parseDate;
	},

	//Parsedate to format 26 Aug 2013 05:14
	getCurrentTime : function(){
		var currentDateTime = new Date();
		currentDateTime = moment(currentDateTime).format("DD/MM/YYYY hh:mm A");;
		return currentDateTime;
	},


	parseTime : function(dateString){
		var parseDate = new Date();
		if(dateString){
			var date = new Date (dateString);
			var momentDate = moment(dateString);
			parseDate = momentDate.format("h:mm a");

		}
		return parseDate;
	},

	parseDate : function(dateString){
		var parseDate = new Date();
		if(dateString){
			var date = new Date (dateString);
			var momentDate = moment(dateString);
			parseDate = momentDate.format("DD MMM YYYY");

		}
		return parseDate;
	},

	getTodayDateInFormat : function(){
		var parseDate = new Date();
		if(parseDate){
			// var date = new Date (dateString);
			var momentDate = moment(parseDate);
			parseDate = momentDate.format("MM/DD/YYYY");

		}
		return parseDate;
	},

	daydiff: function(first, second) {
		var noOfDays = (second-first)/(1000*60*60*24);
		noOfDays = parseInt(noOfDays);
    	return noOfDays;
  	},

  	toggleBoolSwitch: function(element){
  		if($(element).hasClass('inset')){
  			element = $(element).children('.control');
  		}
  		if (!$(element).parent().parent().hasClass('disabled')) {
        if ($(element).parent().parent().hasClass('true')) {
            $(element).parent().parent().addClass('false').removeClass('true');
        } else {
            $(element).parent().parent().addClass('true').removeClass('false');
        }
      }

  	},

  	getFileExtension: function(fileName){
  		var fileExt = '';
  		if(fileName){
  			var fileNameArray = fileName.split('.');
  			fileExt = fileNameArray[fileNameArray.length-1].toLowerCase();
  		}
  		return fileExt;
  	},

  	showNotification: function (elmId, message,  type) {
	    // Possible type values: error, success, info
	    var alertType = (type)? type : "info";
	     $("#" + elmId).html('');
	    $("#" + elmId).append($('<div class="alert alert-' + alertType + ' fade in" data-alert><button type="button" class="close" data-dismiss="alert">&times;</button><p> ' + message + ' </p></div>'));
	      $("#" + elmId).find(".close").click(function() {
	       $(this).parent().remove();
	      })
	 },

	 hideNotification: function(elementId){
	 	$('.alert.fade.in').remove();
	 	// $('#'+elementId).children().remove();
	 },

	getImageObject: function(file, successCB, errorCB, context){
	    var reader = new FileReader();
	    var image  = new Image();
	    var imageObj = {};
	    reader.readAsDataURL(file);  
	    reader.onload = function(_file) {
	        image.src    = _file.target.result;
	        image.onload = function() {
	        	imageObj.width = this.width;
	        	imageObj.height = this.height;
	        	imageObj.type = file.type;
	        	imageObj.name = file.name;
	        	imageObj.size = ~~(file.size/1024) +'KB';
	        	imageObj.src = image.src ;
	        	successCB(imageObj, context);
	            //$('#uploadPreview').append('<img src="'+ this.src +'"> '+w+'x'+h+' '+s+' '+t+' '+n+'<br>');
	        };
	        image.onerror= function() {
	        	imageObj.error = 'Invalid file type: '+ file.type;
	        	$.proxy(errorCB(imageObj, context));
	        };      
	    };
	 },

	 validateImageFile: function(file){
	 	var file = file, isValidImage = true;
	    if(file){
	      var fileExt = utility.comn.getFileExtension(file.name)
	      var fileMimeType = file.type;
	      if(fileExt != 'png' && fileExt != 'jpeg' && fileExt != 'gif' && fileExt != 'jpg' && fileExt != 'bmp'){
	        isValidImage = false;
	      }
	    }
	    return isValidImage;
	 },

	 validateResolution: function(imageObj, activeTab){
	 	var imageValidated = false;
	    switch(activeTab){
	      case 'thumbnail':
	        if(imageObj.height == 400 && imageObj.width == 400){
	          imageValidated = true;
	        }else{
	          utility.comn.showNotification("catalogAlert-div", "Please upload the image of resolution 400 X 400", "error");
	        }
	        break;
	      case 'small':
	        if(imageObj.width == 720 && imageObj.height == 960){
	          imageValidated = true;
	        }else{
	          utility.comn.showNotification("catalogAlert-div", "Please upload the image of resolution 720 X 960", "error");
	        }
	        break;
	      case 'large':
	        if(imageObj.width == 1080 && imageObj.height == 1920){
	          imageValidated = true;
	        }else{
	          utility.comn.showNotification("catalogAlert-div", "Please upload the image of resolution 1080 X 1920", "error");
	        }
	        break;
	    }
	    return imageValidated;
	 },

	 postForm: function(uploadForm, url, successCB, errorCB, context){
	 	var formData  = typeof(uploadForm.prop) == 'undefined' ? uploadForm : new FormData(uploadForm[0]); 
	 	var self = this;
        this.showMask();
        $.ajax({
          xhrFields: {withCredentials:true},
          url: url, 
          type: 'POST',
          success: function (data, textStatus, jqXHR) {
          	self.hideMask();
          	$.proxy(successCB(data, context));
          },
          error: function (error) {
          	self.hideMask();
            $.proxy(errorCB(error, context));
          },
          // Form data
          data: formData,
          //Options to tell JQuery not to process data or worry about content-type
          cache: false,
          contentType: false,
          processData: false
        });
	 },

	 getPromoDetailObject : function(promoObject, isCreate){
	 	var promoCode = {};
	 	promoCode.isCreate = isCreate;
	 	if(!$.isEmptyObject(promoObject)){
			promoCode.name = promoObject.campaign || 'N/A';
			promoCode.description = promoObject.description || 'N/A';
			promoCode.applicableAt = enums.promocodeApplicable[promoObject.promo_type || 1];
			promoCode.commisionBearer = enums.commisionBearer[promoObject.is_merchant_fulfilled || 0]; 
			promoCode.startDate =promoObject.valid_from ? utility.comn.parseDateTime(promoObject.valid_from) : 'N/A';
			promoCode.endDate = promoObject.valid_upto ? utility.comn.parseDateTime(promoObject.valid_upto): 'N/A';
			promoCode.success_message = promoObject.success_message || 'N/A';
			promoCode.failure_message = promoObject.failure_message || 'N/A';
			promoCode.PromoType = {};
			if(!$.isEmptyObject(promoObject.actions)){
				if("giveCashback" in promoObject.actions){
					var cashback = promoObject.actions.giveCashback;
					promoCode.PromoType.giveCashback = {};
					promoCode.PromoType.giveCashback.type = cashback.type; 
					promoCode.PromoType.giveCashback.delay = parseInt(cashback.delay)/60000; 
					promoCode.PromoType.giveCashback.value  = cashback.value;
				}
				else if("applyDiscount" in promoObject.actions){
					promoCode.PromoType.applyDiscount = promoObject.actions.applyDiscount;
				}
				else if("freeshipping" in promoObject.actions){
					promoCode.PromoType.freeshipping = promoObject.actions.freeshipping;
		        }
		        else if("addProducts" in promoObject.actions){
		          promoCode.PromoType.addProducts = promoObject.actions.addProducts;
		        }
		        else if("logUsage" in promoObject.actions){
		          promoCode.PromoType.logUsage = promoObject.actions.logUsage;
		        }

			}

			// second step
			var budget = 'N/A', maxOrderVal = 'N/A', minOrderVal = 'N/A';
			promoCode.code = promoObject.code || 'N/A';
			promoCode.conditions = {};
			if(promoObject.conditions){
				var conditions = promoObject.conditions;
				promoCode.conditions.budget = conditions.budget || 'N/A';
				promoCode.conditions.promocode_usage_amount = conditions.promocode_usage_amount || 'N/A';
				promoCode.conditions.amount_2 = conditions.amount && conditions.amount.length ? conditions.amount[1] || 'N/A' : 'N/A';
				promoCode.conditions.amount_1 = conditions.amount && conditions.amount.length ? conditions.amount[0] || 'N/A' : 'N/A';
				
				promoCode.conditions.promocode_usage_count_by_orders =  conditions.promocode_usage_count_by_orders  == 1 ? 'Once': (conditions.promocode_usage_count_by_orders || 1) +' times';

				// third step 
				promoCode.conditions.merchant_ids = conditions.merchant_name && conditions.merchant_name.length ? conditions.merchant_name.join(',') : 'N/A';
				promoCode.conditions.category_ids = conditions.category_name && conditions.category_name.length ? conditions.category_name.join(',') : 'N/A';
				promoCode.conditions.skus = conditions.product_name && conditions.product_name.length ? conditions.product_name.join(',') : 'N/A';
				promoCode.conditions.brand_ids = conditions.brand_name && conditions.brand_name.length ? conditions.brand_name.join(',') : 'N/A';
				promoCode.conditions.users_ids = conditions.users && conditions.users.length ? conditions.users.join(',') : 'N/A';  
				promoCode.conditions.users = conditions.users_name && conditions.users_name.length ? conditions.users_name.join(',') : 'N/A';  
				promoCode.conditions.platform = conditions.platform && conditions.platform.length ? conditions.platform.join(',') : 'N/A';  	 	 	
			}
			promoCode.errors = promoObject.errors;	
	 	}
	 	return promoCode;
	 },

	 consoleLogger : function(logMessage){
	 	var currentDateTime = new Date();
		currentDateTime = moment(currentDateTime).format("hh:mm:ss A");
	 	console.log("<br> " + logMessage  + " " + currentDateTime + " <br>");
	 },

	 showMask: function(){
	 	$('.md-overlay').show();
	 },

	 hideMask: function(){
	 	$('.md-overlay').hide();
	 }
	 
	 
}