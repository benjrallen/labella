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
				showDescriptions: true,
				showTitles: true
			});
		
		contactPage();
		
	});	

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
