
var ChatPanel = {
	Models : {},
	Views : {},
	Collections : {},
  Router: {}
};


// starts here...
$(function(){
	
	// Template delimiters change
    _.templateSettings = {
      interpolate: /\{\{\=(.+?)\}\}/g,
      evaluate: /\{\{(.+?)\}\}/g
    };

    
    Backbone.View.prototype.eventAggregator = _.extend({}, Backbone.Events);
    Backbone.View.prototype.close = function () {
  		this.$el.empty();
  		this.unbind();
	};
});