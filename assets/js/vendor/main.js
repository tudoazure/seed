// JavaScript Document
	$(function() {
		  $('#toggle4').click(function() {
	$('.toggle4').slideToggle('fast');
	return false;
});
		});
		
		
		
		
$('.has-submenu > a').on('click', function(e){

    e.preventDefault();
				
    $(this).next('ul').find('> li').slideToggle();

    // If it's a level one link & there's other open links...
    if($(this).parent("li").parent("ul").hasClass("level-1") && $(".level-1 > li > a").hasClass("nav-open")) {
        //... collapse the top level open link.
        $(".level-1 > li > a.nav-open").next('ul').find('> ').slideToggle();
        $(".level-1 > li > a.nav-open").removeClass("nav-open");
    }
	
    $(this).toggleClass('nav-open');
});		