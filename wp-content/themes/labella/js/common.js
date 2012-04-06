(function($){
	
	//transitionTime
	var transTime = 250,
		//maxWidth = 960;
		respondWidth = 620,
		isResponsive = false,
		rotator = null,
		slideSize = {
			width:  922,
			height: 359
		};
		
	$(document).ready(function(){
		
		$('html.ie').length ? Ease.ie = true : Ease.ie = false;
		$('html.lte8').length ? Ease.lte8 = true : Ease.lte8 = false;
		typeof WebKitPoint !== 'undefined' ? Ease.webkit = true : Ease.webkit = false;
				
		autoMenu();
		
		//scrollingNav();
		
        rotator = new EaseRotator({
             transitionTime: 750,
             timeoutTime: 7000,
             showControls: true,
             autoRotate: true
        });
		
		
		//console.log( rotator );
		
		var leGallerie = new EasePhotoGallery({
				paginate: 5,
				useFrame: true,
				frameResponds: respondWidth,
				dataEl: '#ease-gallery-data-el',
				showDescriptions: true,
				showTitles: true
			});
		
		contactPage();
		
		$(window).resize(responsiveRotator);
		
		$(window).trigger('resize');
		
	});	

	
	/*
	slideSize = {
		width:  922,
		height: 359
	};
	*/
	
	function responsiveRotator(e){
		if( rotator.EXISTS && Modernizr.mq('only all and (max-width: '+respondWidth+'px)') ){
			//console.log('rotator responding', rotator);
			
			//var newHeight = Math.floor( $(window).width() * slideSize.height / slideSize.width );
			
			rotator.container.height( Math.floor( $(window).width() * slideSize.height / slideSize.width ) );
			//rotator.slider.height(newHeight);
			
			//track semiglobal isResponsive variable
			if( !isResponsive )
				isResponsive = true;
		} else if ( isResponsive ) {
			//DO SOMETHING...
			rotator.container.removeAttr('style');
			//rotator.slider.removeAttr('style');
			//set the global back to false
			isResponsive = false;
		}
		
	};


	function contactPage(){
		if( $('#gMap').length ){
			new EaseMap({
				streetViewControl: true,
				fitMarkers: false,
				zoom: 12,
				//centerLat: 36.153077,
				//centerLng: -95.989392,
				centerLat: 36.126992,
				centerLng: -95.947181,
				mapHeight: 406,
				contId: 'gMap',
				locationKey: 'la_bella_location_address',
				markerScale: 0.4,
				markerImageKey: 'featured_custom_marker',
				blocksAreClickable: true,
				scrollToMapOnClick: true,
				scrollSpeed: 450,
				directionsLink: true
			});
			
			//block the location links from doing anything.
			//console.log( $('.entry-content .locationList a') );
			//$('.entry-content .locCont a').live('click', function(e){
			//	e.preventDefault();
			//});
		}	
	}
	
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
