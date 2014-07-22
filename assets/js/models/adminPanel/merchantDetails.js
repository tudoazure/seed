"use strict";
 //(function () {
    AdminPanel.Models.MerchantDetails = Backbone.Model.extend({
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
        address:{address:"", city:"", state:"", pinCode:"", lastUpdated:""},
        bank:{name:"", ifsc:"", branchName:"", beneficiaryName:"", accountNo:"", cancelledCheque:"", lastUpdated:""},
        kyc: {panNo:"", panPath: "", vatNo:"", vatPath:"", addressProof:"", addressProofPath:"", idProof:"", idProofPath:"", lastUpdated:""},
      },

      parse: function(resp){
        var merchantDetails = {};

        // General Information
        merchantDetails.id = (resp.merchant && resp.merchant.id) ?  resp.merchant.id : "";
        merchantDetails.name = (resp.merchant && resp.merchant.name) ?  resp.merchant.name : "";
        merchantDetails.displayName = (resp.merchant && resp.merchant.display_name) ?  resp.merchant.display_name : "";
        merchantDetails.companyName = (resp.merchant && resp.merchant.company_name) ?  resp.merchant.company_name : "";
        merchantDetails.email = (resp.merchant && resp.merchant.email_id) ?  resp.merchant.email_id : ""; 
        merchantDetails.mobile = (resp.merchant && resp.merchant.mobile_no) ?  resp.merchant.mobile_no : ""; 
        merchantDetails.landline = (resp.merchant && resp.merchant.landline_no) ?  resp.merchant.landline_no : ""; 
        merchantDetails.companyLogo = (resp.merchant && resp.merchant.company_logo_path) ?  resp.merchant.company_logo_path : ""; 
        merchantDetails.shipping = (resp.merchant && resp.merchant.max_shipping_days) ?  resp.merchant.max_shipping_days : "";
        merchantDetails.commission = (resp.merchant && resp.merchant.pg_commission) ?  resp.merchant.pg_commission : ""; 
        merchantDetails.createdDate = (resp.merchant && resp.merchant.created_at) ?  utility.comn.parseDate(resp.merchant.created_at) : ""; 
        merchantDetails.createdTime = (resp.merchant && resp.merchant.created_at) ?  utility.comn.parseTime(resp.merchant.created_at) : "";
        merchantDetails.lastModifiedDate = (resp.merchant && resp.merchant.created_at) ?  utility.comn.parseDate(resp.merchant.updated_at) : "";
        merchantDetails.lastModifiedTime = (resp.merchant && resp.merchant.created_at) ?  utility.comn.parseTime(resp.merchant.updated_at) : "";
        merchantDetails.primaryContactName = (resp.merchant && resp.merchant.am_name) ?  resp.merchant.am_name : ""; 
        merchantDetails.primaryContactEmail = (resp.merchant && resp.merchant.am_email_id) ?  resp.merchant.am_email_id : ""; 
        merchantDetails.primaryContactMobile = (resp.merchant && resp.merchant.am_mobile_no) ?  resp.merchant.am_mobile_no : ""; 
        merchantDetails.altContactName = (resp.merchant && resp.merchant.am_name) ?  resp.merchant.am_name : "";
        merchantDetails.altContactEmail = (resp.merchant && resp.merchant.am_email_id) ?  resp.merchant.am_email_id : "";
        merchantDetails.altContactMobile = (resp.merchant && resp.merchant.am_mobile_no) ?  resp.merchant.am_mobile_no : ""; 
        merchantDetails.status = (resp.merchant && resp.merchant.status) ?  resp.merchant.status : "";
        merchantDetails.info = (resp.merchant && resp.merchant.info) ?  resp.merchant.info : "";
        
        // Address Details

        merchantDetails.address = {};
        merchantDetails.address.address = (resp.address && resp.address.address) ?  resp.address.address : ""; 
        merchantDetails.address.city = (resp.address && resp.address.city) ?  resp.address.city : ""; 
        merchantDetails.address.state = (resp.address && resp.address.state) ?  resp.address.state : ""; 
        merchantDetails.address.pinCode = (resp.address && resp.address.pin_code) ?  resp.address.pin_code : ""; 
        merchantDetails.address.lastUpdated = (resp.address && resp.address.updated_at) ?  resp.address.updated_at : ""; 

        // Bank Details
        merchantDetails.bank = {};
        merchantDetails.bank.name = (resp.finance && resp.finance.bank_name) ? resp.finance.bank_name : "";
        merchantDetails.bank.ifsc = (resp.finance && resp.finance.ifsc_code) ? resp.finance.ifsc_code : "";
        merchantDetails.bank.branchName = (resp.finance && resp.finance.branch_name) ? resp.finance.branch_name : "";
        merchantDetails.bank.beneficiaryName = (resp.finance && resp.finance.beneficiary_name) ? resp.finance.beneficiary_name : "";
        merchantDetails.bank.accountNo = (resp.finance && resp.finance.bank_account_no) ? resp.finance.bank_account_no : "";
        merchantDetails.bank.cancelledCheque = (resp.finance && resp.finance.cancelled_check_path) ? resp.finance.cancelled_check_path : "";
        merchantDetails.bank.lastUpdated = (resp.finance && resp.finance.updated_at) ? resp.finance.updated_at : "";

        // KYC Details
        merchantDetails.kyc = {};
        merchantDetails.kyc.panNo = (resp.kyc && resp.kyc.pan_card_no) ?  resp.kyc.pan_card_no : "";
        merchantDetails.kyc.panPath = (resp.kyc && resp.kyc.pan_card_file_path) ?  resp.kyc.pan_card_file_path : "";
        merchantDetails.kyc.vatNo = (resp.kyc && resp.kyc.vat_no) ?  resp.kyc.vat_no : "";
        merchantDetails.kyc.vatPath = (resp.kyc && resp.kyc.vat_no_file_path) ?  resp.kyc.vat_no_file_path : "";
        merchantDetails.kyc.addressProof = (resp.kyc && resp.kyc.address_proof) ?  resp.kyc.address_proof : "";
        merchantDetails.kyc.addressProofPath = (resp.kyc && resp.kyc.address_proof_file_path) ?  resp.kyc.address_proof_file_path : "";
        merchantDetails.kyc.idProof = (resp.kyc && resp.kyc.id_proof) ?  resp.kyc.id_proof : "";
        merchantDetails.kyc.idProofPath = (resp.kyc && resp.kyc.id_proof_file_path) ?  resp.kyc.id_proof_file_path : "";
        merchantDetails.kyc.lastUpdated = (resp.kyc && resp.kyc.updated_at) ?  resp.kyc.updated_at : "";

        return merchantDetails;
      }
    });
//}());