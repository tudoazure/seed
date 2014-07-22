"use strict";

$(function() { 
  ChatPanel.Views.MasterView = Backbone.View.extend({

    el: constants.common.LeftNav_EL_ID, 

    template : null,

    tagName: '',

    currentTab : constants.common.BargainChatTab,

    events: {
        "click .nav-tabs" : "onTabClick"
    },

    initialize: function(){
        var self = this;
        this.template = _.template( $('#leftNav-template').html());
        _.bindAll(this, 'render');
        this.render();
        this.renderCurrentTab();
        this.headerView = new ChatPanel.Views.HeaderView();
        this.listenTo(Backbone, 'closeAllViewLogout-Event', function (data) {
          this.logout();
      }, this );
        // this.tabContentView = new MerchantPanel.Views.TabContentView({parent:this});
    },

    render: function(){
        this.$el.html( this.template());
        return this;
    },

    onTabClick: function(e){
        if(this.currentTab != $(e.target).attr('href')){
            this.currentTab = $(e.target).attr('href');
            this.renderCurrentTab();
        }
    },

   renderCurrentTab: function(){
        // var currentTab = this.options.parent.currentTab;
        this.closeAllTabViews();
        switch(this.currentTab){
            case constants.common.MerchantTab:
                $('#tabHeading').html('Merchant');
                if(this.merchantView){
                    this.merchantView.render();
                }else{
                    this.merchantView = new ChatPanel.Views.MerchantView();
                }                
                break;
            case constants.common.OrderTab:
                $('#tabHeading').html('Orders');
                if(this.orderView){
                    this.orderView.render();
                }else{
                    this.orderView = new ChatPanel.Views.OrderMasterView();
                }  
                break;
            case constants.common.CatalogTab:
                $('#tabHeading').html('Catalog');
                if(this.catalogView){
                    this.catalogView.render();
                }else{
                    this.catalogView = new ChatPanel.Views.CatalogView();
                }  
                break;
            case constants.common.StorefrontTab:
                $('#tabHeading').html('Storefront');
                if(this.storefrontView){
                    this.storefrontView.render();
                }
                else{
                   this.storefrontView =  new ChatPanel.Views.StorefrontView();
                }
                break;
            case constants.common.PromocodeTab:
                $('#tabHeading').html('Promocode');
                if(this.promocodeView){
                    this.promocodeView.render();
                }else{
                    this.promocodeView = new ChatPanel.Views.PromocodeView();
                }                
                break;
            case constants.common.BargainChatTab:
                $('#tabHeading').html('Bargain Chat');
                if(this.bargainChatView){
                    this.bargainChatView.render();
                }else{
                    this.bargainChatView = new ChatPanel.Views.BargainChatView();
                }
                break;
            case constants.common.BargainAgentTab:
                $('#tabHeading').html('Bargain Agent Managment');
                if(this.bargainAgentView){
                    this.bargainAgentView.render();
                }else{
                    this.bargainAgentView = new ChatPanel.Views.BargainAgentView();
                }
                break;
            case constants.common.PaymentTab:
                $('#tabHeading').html('Payment Summary Tab');
                if(this.paymentView){
                    this.paymentView.render();
                }else{
                    this.paymentView = new ChatPanel.Views.PaymentMasterView();
                }
                break;
        }
    },

    closeAllTabViews: function(){
        if(this.merchantView){
            this.merchantView.close();
        }
        if(this.storefrontView){
            this.storefrontView.close();
        }
        if(this.bargainChatView){
            this.bargainChatView.close();
        }
        if(this.promocodeView){
            this.promocodeView.close();
        }
        if(this.orderView){
            this.orderView.close();
        }
        if(this.catalogView){
            this.catalogView.close();
        }
        if(this.bargainAgentView){
            this.bargainAgentView.close();
        }
        if(this.paymentView){
            this.paymentView.close();
        }
    },

    logout : function(e){
        this.closeAllTabViews();
        window.location.href = '/adminlogout';
    }

  }); 
  var chatPanelView = new ChatPanel.Views.MasterView();

  $(document).unbind('keydown').bind('keydown', function (event) {
    var doPrevent = false;
    if (event.keyCode === 8) {
        var d = event.srcElement || event.target;
        if ((d.tagName.toUpperCase() === 'INPUT' && (d.type.toUpperCase() === 'TEXT' || d.type.toUpperCase() === 'PASSWORD' || d.type.toUpperCase() === 'FILE')) 
             || d.tagName.toUpperCase() === 'TEXTAREA') {
            doPrevent = d.readOnly || d.disabled;
        }
        else {
            doPrevent = true;
        }
    }

    if (doPrevent) {
        event.preventDefault();
    }
});
});