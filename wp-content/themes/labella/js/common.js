(function($){
	
	//transitionTime
	var transTime = 250,
		//maxWidth = 960;
		maxWidth = 0;
		
	$(document).ready(function(){
		
		$('html.ie').length ? Ease.ie = true : Ease.ie = false;
		$('html.lte8').length ? Ease.lte8 = true : Ease.lte8 = false;
		typeof WebKitPoint !== 'undefined' ? Ease.webkit = true : Ease.webkit = false;
				
		autoMenu();
		
		//scrollingNav();
		
        var fpRotate = new EaseRotator({
             transitionTime: 750,
             timeoutTime: 7000,
             showControls: true,
             autoRotate: true
         });
		
		
		var leGallerie = new EasePhotoGallery({
				paginate: 5,
				useFrame: true,
				dataEl: '#ease-gallery-data-el',
				showDescriptions: false,
				showTitles: false
			});
		
	});	

/*
	//controls the absolute/fixed positioning of the nav sidebar
	function scrollingNav(){
		if ( !$('#sidebar').length )
			return false;
		
		var nav = $('#sidebar'),
			content = $('#content'),
			whole = $('#whole'),
			wholeWidth = $('#whole').outerWidth(),
			bodyTop = $('body').position().top * -1, //body border-top-width, doesn't change
			navWidth = nav.width(), //doesn't change
			navPos = {	//is the defined css position (top and left in the stylesheet) as an integer
				left: parseInt( nav.css('right').replace('px','') ),
				top: parseInt( nav.css('top').replace('px','') )
			},
			navLeft,
			contTop,
			navIsFixed = false,
			navIsHidden;
		
		//used to calculate the variables
		var calculateVariables = function(){
			navLeft = nav.offset().left;
			contTop = content.offset().top + bodyTop;
			navIsHidden = nav.is(':hidden');
			
			if ( navIsFixed ){
				navLeft = content.offset().left + wholeWidth + navPos.left;
				nav.css({ left: navLeft });
			}
			//trigger scroll to update position
			$(window).trigger('scroll');
		};
		
		//calculate them
		calculateVariables();

		//recalculate when window size changes (Ã  cause du designe rÃ©ponsive)
		$(window).resize( calculateVariables );
		
		$(window).scroll(function(e){
			//only do this stuff if the navigation is actually showing
			if ( !navIsHidden ){
				var sTop = $(this).scrollTop();
				
				if ( sTop > contTop ) {
					if ( !navIsFixed ) {
						nav.css({ position: 'fixed', left: navLeft, right: 'auto' });
						navIsFixed = true;
					}
					
				} else if ( navIsFixed ) {
					nav.css({ position: 'absolute', right: navPos.left, left: 'auto' });
					navIsFixed = false;
				}
			}
		});
		
		//trigger it at beginning to update if page loads in middle
		$(window).trigger('scroll');
	}
*/	
	
	function autoMenu(){
		if ( $('nav#access').length ) {
			var access = $('nav#access');
			
			//console.log( access.find('li').first().height(), access.height() );
			
			if ( access.height() > access.find('li').first().height() )
				access.before('<div class="clearfix"></div>')
			
			access.hide().css({ zIndex: 2 }).fadeIn( transTime );
			
		}
	}
	
	
})(jQuery);
