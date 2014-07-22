/*
    Top Header View
*/
"use strict";

ChatPanel.Views.HeaderView = Backbone.View.extend({

    el: constants.common.Header_EL_ID, 

    template : null,

    tagName: '',

    events: {
       "click .adminlogout" : "logoutClick" 
    },

    initialize: function(){
        var self = this;
        this.template = _.template( $('#header-template').html());
        _.bindAll(this, 'render');
        this.render();
    },

    render: function(){
        this.$el.html( this.template());
        return this;
    },

    logoutClick: function(e){
        Backbone.trigger('closeAllViewLogout-Event');
    }

}); 