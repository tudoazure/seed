(function(){
AdminPanel.Router.MainRouter = Backbone.Router.extend({
	routes: {
        '': 'showOrdersView1',
        'orders': 'showOrdersView',
        'merchant' : 'showMerchantsView',
    },

    showOrdersView : function(){
        this.closeAllView();
    	if(this.orderView){
            this.orderView.render();
        }else{
            this.orderView = new AdminPanel.Views.OrderMasterView();
        }  
    	//this.closeAllView();
    },

    showMerchantsView : function(){
    	if(this.merchantView){
            this.merchantView.render();
        }else{
            this.merchantView = new AdminPanel.Views.MerchantView();
        } 
    },


});

var mainRouter = new AdminPanel.Router.MainRouter;
Backbone.history.start();

$('.orders').click(function() {
    mainRouter.navigate('orders', { trigger: true });
});
$('.merchant').click(function() {
    mainRouter.navigate('merchant', { trigger: true });
});

})();