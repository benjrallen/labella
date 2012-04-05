// place any jQuery/helper plugins in here, instead of separate, slower script files.


/*
 * Try/Catch the console
 */
try{
    console.log('Hello Console.');
} catch(e) {
    window.console = {};
    var cMethods = "assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(",");
    for (var i=0; i<cMethods.length; i++) {
        console[ cMethods[i] ] = function(){};
    }
}



(function($){
	
	var EaseRotator = function(config){
		var me = this,
			defaults = {
				contID: 'rotator',
				sliderClass: 'slides',
				controlsClass: 'controls',
				nextText: '>>',
				prevText: '<<',
				z: 1, //z-index set to 1 in css for the slides
				transitionTime: 1000,
				gidAtt: 'gid', //attribute to look for on the controls
				timeoutTime: 7500,
				showControls: false, //false, true, or 'binary'.  'binary' will print out the controls as prev/next only
				linkTo: false,
				linkClickCallback: function(){},
				autoRotate: false, //set to true to start the rotation automatically.  key if you just instantiate the rotator and not the controller
				appendControlsTo: false //css selector.  if set, the controls get appended to a specific element
			};
			
		for (var key in config) {
			defaults[key] = config[key] || defaults[key];
		}
	
		for (var key in defaults) {
			me[key] = defaults[key];
		}
		
		//unconfigurable variables		
		me.container = null;
		me.slider = null;
		me.slides = null;
		me.controls = null;
		me.sliderTimeout = null;
		
		me.currentSlide = [];
		me.nextSlide = null;
		
		me.binaryControls = null;
		
		me.RUNNING = false;
		
		me.other = false;
		
		me.init = function(){
			if( $('#'+me.contID).length ){
				//initialize variables
				me.container = $('#'+me.contID);
				me.slider = me.container.find('.'+me.sliderClass);
				me.slides = me.slider.children(); 
				
				if( me.slides.length < 2 )
					return false;
																
				//print controls
				me.controls = me.makeControls();
				
				//the last slide is the one that shows onload
				me.controls.children().last().addClass('active');
				me.slides.last().addClass('active');
				
				me.currentSlide = me.slides.last();
								
				//so set all the others to 0 opacity
				me.slides.not('.active').fadeOut(0);

				//only rotate if the slider is visible
				$(window).resize(me.onResize);
				
				//'trigger it'
				me.onResize();
				
				me.RUNNING = true;
			}
			
			return me;
		};
		
		me.isRunning = function(){
			return me.RUNNING;
		};
		
		me.onResize = function(e){
			
			if ( me.container.is(':visible') ) {
				//start the change timer
				if( !me.sliderTimeout && me.autoRotate )
					me.sliderTimeout = setTimeout( me.sliderTimeoutFunc, me.timeoutTime );
			} else {
				if ( me.sliderTimeout && me.autoRotate ) {
					clearTimeout( me.sliderTimeout );
					me.sliderTimeout = null;
					//console.log( 'timeout cleared', me.sliderTimeout );
				}
			}
		}
		
		me.makeControls = function(){
			var ctrls = $('<div />').addClass( me.controlsClass );
			
			//make a selector for each slide
			me.slides.each(function(i){
				var gid = $(this).attr(me.gidAtt);
				var ctrl = $('<div />', { text: i+1 }).attr( me.gidAtt, gid ).click(me.ctrlClickHandle).appendTo( ctrls );
			});
			
			//do we want to show binary controls?
			if ( !me.showControls || me.showControls === 'binary' )
				ctrls.hide();
			
			if ( me.showControls === 'binary' )
				me.binaryControls = me.makeBinaryControls();
			
			//ctrls.appendTo(me.container);
			//this functionality was added for UPAL to have controls in a flag.
			if ( me.appendControlsTo && $(me.appendControlsTo).length ) {
				ctrls.appendTo( me.appendControlsTo );
			} else {
				ctrls.appendTo(me.container);
			}
			
			return ctrls;

		};
		
		me.makeBinaryControls = function(){
			var ctrls = $('<div />').addClass( me.controlsClass );
			
			//make prev/next selctors to switch through the slides
			$('<span />', { text: me.prevText }).addClass('prev').click(me.binaryCtrlClickHandle).appendTo( ctrls );		
			$('<span />', { text: me.nextText }).addClass('next').click(me.binaryCtrlClickHandle).appendTo( ctrls );		
			
			ctrls.appendTo( me.container );
			
			return ctrls;
		};
		
		me.ctrlClickHandle = function(e){
			var gid = $(this).attr(me.gidAtt)
			
			me.slideChange( gid );
			
			return me.linkClickCallback( gid, me.linkTo );
		}
		
		//the numbered controls are still there, so click on a back or forward looks at those controls to decide which one is next
		me.binaryCtrlClickHandle = function(e){
			//find the next slide gid in the list (of the actual numbered controls)
			var gid = ( $(this).hasClass('prev') ?
						//go back
						me.getPreviousSlide().attr(me.gidAtt) :
						//go forward
						me.getNextSlide().attr(me.gidAtt)
					);
			
			me.slideChange( gid );
			
			return me.linkClickCallback( gid, me.linkTo );
		};

		me.getNextSlide = function(){
			return ( me.currentSlide.next().length ? 
							me.currentSlide.next() : 
							me.currentSlide.parent().children().first() );
		};
		me.getPreviousSlide = function(){
			return ( me.currentSlide.prev().length ? 
							me.currentSlide.prev() : 
							me.currentSlide.parent().children().last() );
		};
		
		me.getSlideByID = function(){};
		
		me.slideChange = function( gid ){
			//var gid = ctrl.attr( me.gidAtt );
			
			var ctrl = me.getControlByID( gid );
			
			if ( !ctrl.hasClass('active') ) {
				//clear the timeout transition.  this will allow us to essentially reset the change timer
				if( me.sliderTimeout )
					clearTimeout( me.sliderTimeout);
				
				//increment the target z-index up by one
				me.z++;
				
				//get the target slide
				me.nextSlide = me.getSlideByID( gid );

				//switch to the new slide
				me.fadeChange();
				
												
				//turn off the old one
				me.controls.find('.active').removeClass('active');
				//turn on the corresponding control circle
				ctrl.addClass('active');

//				//known bug in Sizzle engine with .siblings() when using a selector.  returns empty array.
//				//turn on the corresponding control circle
//				ctrl.addClass('active')
//					//and turn off the old one
//					.siblings('.active').removeClass('active');
					
				//start the change timer
				return ( me.autoRotate ? me.sliderTimeout = setTimeout( me.sliderTimeoutFunc, me.timeoutTime ) : true );
			}
		};
				
		me.fadeChange = function(){
			if ( !me.nextSlide ) return false;
						
			//stop the animation if one is fading in
			me.slider.find( me.currentSlide ).stop(false, false);
			
			//finish the animation for those that are fading out (all not active slides are told to fade out everytime)
			me.slides.not( me.nextSlide ).stop(true,false);
			
			//set this one as active to signify that it is fading in.
			me.nextSlide.addClass('active')
				//move it to the top
				.css({ zIndex: me.z })
				//clear its animation queue cause we are using setTimeout and might have a stacked queue
				.stop(true,true)
				//fade it in
				.fadeTo( me.transitionTime, 1)
			
			//get all the other slides
			me.slides.not( me.nextSlide )
				//clear its animation queue cause we are using setTimeout and might have a stacked queue
				.stop(true,true)					
				//tell them to get to zero opacity
				.fadeOut(me.transitionTime)
				//and tell them that none of them are fading in
				.removeClass('active');
					
			//set the new active		
			me.currentSlide = me.nextSlide;
			me.nextSlide = null;	
		};
		
		//used in the controller
		me.getControlByID = function( gid ){
			if ( !gid ) return false;
			return me.controls.find('['+me.gidAtt+'="'+gid+'"]');	
		};

		me.getSlideByID = function( gid ){
			if ( !gid ) return false;
			return me.slider.find('['+me.gidAtt+'="'+gid+'"]');	
		};

		
		//set up the timeout change function
		me.sliderTimeoutFunc = function(){
			return me.slideChange( me.getNextSlide().attr(me.gidAtt) );
		};
				
		return me.init();		
	}
	
	//expose to window
	window['EaseRotator'] = EaseRotator;
	
	
	//class to control the timeouts on multiple EaseRotators to keep them in sync
	function EaseRotatorController(config){
		
		var me = this,
			defaults = {
				rotatorsConfig: [],
				timeoutTime: 7500
			};
			
		for (var key in config) {
			defaults[key] = config[key] || defaults[key];
		}
	
		for (var key in defaults) {
			me[key] = defaults[key];
		}
		
		me.rotators = {};
		me.sliderTimeout = null;
		
		me.init = function(){
			//rotators should be init objects.  lets start them.
			if( typeof me.rotatorsConfig === 'object' && me.rotatorsConfig.length ){
								
				$.each( me.rotatorsConfig, me.startRotator );
							
				me.sliderTimeout = setTimeout( me.sliderTimeoutFunc, me.timeoutTime );
			}
				
			return me;	
		};
		
		me.startRotator = function(i){			
			//we want to connect the linked clicks
			if( this.linkTo )
				this.linkClickCallback = me.linkClickCallback;
						
			me.rotators[this.contID] = new EaseRotator( this );
		};
		
		me.sliderTimeoutFunc = function(){
			//clear the timeout
			clearTimeout( me.sliderTimeout );
			//rotate each instance
			$.each( me.rotators, me.rotateInstance );
			//reset the timeout
			return me.sliderTimeout = setTimeout( me.sliderTimeoutFunc, me.timeoutTime );
		};
		
		me.rotateInstance = function(i){
			//this is the instance.  fading and changing takes processing power, 
			//	and on mobile layouts, I often hide these rotators.  so do a check
			if( !this.autoRotate && this.RUNNING && this.container.is(':visible') )
				this.slideChange( this.getNextSlide().attr(this.gidAtt) );
			
			return true;
		};
		
		//this is what links the rotators together.  ctrl is element that was clicked, id is the contID that instance is linked to (rotator.linkTo)
		me.linkClickCallback = function( gid, linkTo ){
									
			//only do this if the instance is linked to another
			if ( !gid || !linkTo )
				return false;
			
			//clear the timeout
			clearTimeout( me.sliderTimeout );
			
			//the instance where the call is coming from
			var rotator = this;

			//find the linked instance in the rotators array
			var other = me.rotators[ linkTo ];
			
			//make sure it is running
			if( typeof other === 'object' && other.isRunning() ){
				//get the linked ctrl
				other.slideChange( gid );
			}
			
			return me.sliderTimeout = setTimeout( me.sliderTimeoutFunc, me.timeoutTime );
		};
		
		return me.init();
	}
	
	window['EaseRotatorController'] = EaseRotatorController;
	
})(jQuery);



(function($){
	
	function EasePhotoGallery( config ){
		var me = this,
			defaults = {
				galleryContCls: 'ease-photo-gallery',
				linkCls: 'ease-img-link',
				showTitles: false,
				showDescriptions: false,
				useFrame: false,
				frameHeight: 460,
				frameWidth: 598,
				transTime: 100,
				dataAttr: 'ease_full',
				dataEl: false,  //use a data element with pagination to override the default image link with a scripty pagination
				paginate: false,  //put in a number to tell how many items to paginate
				paginateContCls: 'gallery-page-controls', //default class for the controls wrapper
				popupId: 'easePopup'
				
			};
			
		for (var key in config) {
			defaults[key] = config[key] || defaults[key];
		}
	
		for (var key in defaults) {
			me[key] = defaults[key];
		}
		
		//unconfigurable variables
		//me.CONSTANT = 'constant';
		
		me.currentI = 0;
		me.allData = [];
		me.fullData = [];
		me.currentPage = 1;
		me.maxPages = 0;
		me.pageContainer = false;
		me.pageControls = false;
		me.isIE = ( Ease.ie || $('html.ie').length ? true : false );
		me.galleryExists = false;
		me.popup = false;
		me.frameCont = null;
		me.frame = null;
		
		me.init = function(){
						
			if ( $('.'+me.galleryContCls).length ){
				me.galleryExists = true;
				
				me.gallery = $('.'+me.galleryContCls);

				//check if this is using the a paginated setup
				if ( me.paginate && me.dataEl )
					return me.initPaginated();

				me.links = me.gallery.find('.'+me.linkCls);
				
				
				me.links.each(function(i){
					var data = $(this).attr( me.dataAttr );
						//json = $.parseJSON( data );
						
					//me.allData[i] = json;
					me.allData[i] = $.parseJSON( data );
				});
				
				me.links.click( me.linkClick );
				
				$('body').click( me.closePop );
			}
						
		};

		me.initPaginated = function(){
			//gallery is already set up
			var data = JSON.parse( $(me.dataEl).text() );
			
			for (var i=0; i<data.length; i++){
				me.fullData.push( data[i] );
				me.allData.push( data[i].full );
			}
			
			me.maxPages = Math.ceil( data.length / me.paginate );
			
			if( me.useFrame )
				me.makeFrame();
			
			me.makePageContainer();
			
			me.makePaginateControls();
			
			//this is a selection disabler plugin/function i found.  defined above this class
			if( $.fn.disableSelection )
				$('.pageNext, .pagePrev').disableSelection();
			
			me.buildPage();

			$('body').click( me.closePop );
			
		};
		
		me.makeFrame = function(){
			//console.log( 'me.makeFrame', me.fullData[0] );
			
			//get full photo for first photo in bin
			var data = me.fullData[0];
			
			me.frameCont = $('<div />', { id: 'gallery-frame' });
			me.frame = $('<img />', { 
				src: data.full.src,
				thisI: 0,
				alt: data.full.title
			}).attr( me.dataAttr, JSON.stringify( data.full ) )
			.attr({
				height: data.full.height,
				width: data.full.width
			})
			.click( me.loadPhoto )
			.appendTo( me.frameCont );

			me.frameTip = $('<div />', { html: 'Click image to expand' }).addClass('frame-tip').appendTo( me.frameCont );
			//me.frame = $('<div />', id: { 'gallery-frame' }).insertBefore( me.gallery );
			//me.frame = $('<div />', id: { 'gallery-frame' }).insertBefore( me.gallery );
		
			me.frameCont.insertBefore( me.gallery );

			return me.positionFramePhoto();
		};
		
		me.frameClick = function(e){};
		
		me.makePageContainer = function(){
			me.pageContainer = $('<div />', { id: 'gallery-page-container' });
			
			return me.pageContainer.prependTo( me.gallery );
		};
		
		me.buildPage = function(){
			//get the indexes to loop through from the allDat array.
			var minI = me.currentPage * me.paginate - me.paginate,
				maxI = me.currentPage * me.paginate - 1;
			//console.log('buildPage', minI, maxI);
			
			//clear out the page container
			me.pageContainer.html('');
			
			//loop through pictures and build out the links
			for ( var i=minI; i <= maxI; i++ )
				if( i < me.fullData.length )
					me.makeThumbLink( i ).appendTo( me.pageContainer );
			
			//and set the counter
			me.pageControls.find('.pageCounter').text(''+me.currentPage+' of '+me.maxPages);
		};
		
		//all this data is set up in the gallery page template, and follows along with the original html the php was echo-ing...
		me.makeThumbLink = function( i ){
			var data = me.fullData[i];
			//console.log('me.makeThumbLink', data);

			//add in an 'index' attribut to work with pagination

			var a = $('<a>', {
					href: data.full.src,
					thisI: i, //the 'index' in the data array
					title: data.full.title,
					html:  $('<img />', {
						src: data.thumb[0],
						width: data.thumb[1],
						height: data.thumb[2]
					})
				}).attr( me.dataAttr, JSON.stringify( data.full ) )
				.addClass( me.linkCls)
				.click( me.linkClick );
						
			return a;
		};

		me.makeControl = function( text ){
			return $('<div />', { html: '<span class="icon"></span><span class="text">'+text+'</span>' });
		};

		me.makePaginateControls = function(){
			
			var controls = {
				nextBttn : me.makeControl('Next Page').addClass('pageNext').click(me.nextPage),
				prevBttn : me.makeControl('Prev Page').addClass('pagePrev').click(me.prevPage),
				counter: $('<div />').addClass('pageCounter'),
				clear: $('<div />').addClass('clearfix')
			};
			
			me.pageControls = $('<div />', {}).addClass( me.paginateContCls )
			
			for ( var ctrl in controls ) {
				me.pageControls.append( controls[ctrl] );
			}			
			
			//return me.pageControls.insertBefore( me.pageContainer );
			return me.pageControls.insertAfter( me.pageContainer );
		};
		
		me.nextPage = function(){
			me.currentPage < me.maxPages ?
				me.currentPage++ :
				me.currentPage = 1;
				
			me.buildPage();
		};
		me.prevPage = function(){
			me.currentPage > 1 ?
				me.currentPage-- :
				me.currentPage = me.maxPages;
				
			me.buildPage();
		};
		
		
		
		me.linkClick = function(e){
			e.stopPropagation();
			e.preventDefault();			
			
			if( !$(this).hasClass('active') ){
				me.pageContainer.find('.active').removeClass('active');
				$(this).addClass('active');
			}
			
			return ( me.useFrame ?
				me.loadPhotoInFrame.call( this, e ) :
				me.loadPhoto.call( this, e )
			);
		};
		
		me.loadPhotoInFrame = function( e ){
			e.stopPropagation();
			me.closePop();
			e.preventDefault();			
			
			var i = $(this).attr('thisI');
			
			if( i == me.frame.attr('thisI') )
				return false;
			
			me.frame.stop(false, true).fadeOut( me.transTime, function(){
				
				me.frame.attr({ 
					thisI: i,
					height: me.fullData[i].full.height,
					width: me.fullData[i].full.width,
					src: me.fullData[i].full.src,
					alt: me.fullData[i].full.title
				}).attr( me.dataAttr, JSON.stringify( me.fullData[i].full ) )
				.fadeIn( me.transTime );
				
				me.positionFramePhoto();
			});
			
			
			//console.log( 'me.loadPhotoInFrame', me.fullData[i]  );
			return;
			
		};

		//for proportions
		me.crossMultiply = function( a, b, c ){
			//  a / b = c / d
			// d = b * c / a
			return Math.floor( b * c / a );
		};
		me.halfDifference = function( a, b ){
			return Math.floor( (a-b) / 2 );
		};

		me.positionFramePhoto = function(){
			
			var dimensions = {
				top: 	0,
				left: 	0,
				cH: 	me.frameHeight,
				cW: 	me.frameWidth,
				fH: 	me.frame.attr('height'),
				fW: 	me.frame.attr('width')
			},
			calc = {
				width: me.crossMultiply( dimensions.fH, dimensions.fW, dimensions.cH ),
				height: me.crossMultiply( dimensions.fW, dimensions.fH, dimensions.cW )
			}
			
			//console.log( dimensions.fH, dimensions.fW, calc.height, calc.width );
								
			//position from top
			if( dimensions.cH > calc.height ){
				dimensions.top = me.halfDifference( dimensions.cH, calc.height );
			} else if ( dimensions.cH > dimensions.fH ) {
				dimensions.top = me.halfDifference( dimensions.cH, dimensions.fH );
			}
			//position from left
			if( dimensions.cW > calc.width ){
				dimensions.left = me.halfDifference( dimensions.cW, calc.width );
			} else if ( dimensions.cW > dimensions.fW ) {
				dimensions.left = me.halfDifference( dimensions.cW, dimensions.fW );
			}
			
			me.frame.css({
				top: dimensions.top,
				left: dimensions.left
			});
			
			dimensions = null;
			calc = null;
			return;
		};
		
		me.loadPhoto = function(e){
			e.stopPropagation();
			e.preventDefault();			
			//check for the index value as an attribute of the link.  use it if it is there ( added for paginating )
			if ( $(this).attr('thisI') ) {
				me.currentI = $(this).attr('thisI');
			} else {
				me.currentI = $(this).index();
			}
			me.makePopup();
		};
		
		me.closePop = function(){
			//$('#underlay, #popup').remove();
			if( me.popup )
				me.popup.hide();
		};
		
		me.nextPop = function(){
			me.currentI++;
			if (me.currentI >= me.allData.length) {
				me.currentI = 0;
			}
			me.switchPop();
		};
		
		me.prevPop = function(){
						
			me.currentI == 0 ? me.currentI = me.allData.length - 1 : me.currentI--;
				
			me.switchPop();
		};
		
		me.positionPop = function(){
			//var popup = $('#popup'),
			var	pW = me.popup.width(),
				pH = me.popup.height()
				//dH = $.getDocHeight(),
				//dW = $.getDocWidth(),
				dW = $(window).width(),
				sT = $(document).scrollTop(),
				left = Math.floor( (dW - pW) / 2 );
			
			//console.log('left', left);	
			if ( left < 0 ) left = 0;
			
			me.popup.css({
				top: 40 + sT,
				left: left
			}).show();
		};
		
		me.resizeHeight = function( h, w, max ){			
			//this is simple cross multiplication, and the new height is defined by the max(window) height
			//  w/h = x/max
			var newW = Math.round( max * w / h );
			
			return { height : max, width : newW };
		}
		
		me.resizeWidth = function( h, w, max ){
			//this is simple cross multiplication, and the new width is defined by the max(window) width
			//  w/h = max/y
			var newH = Math.round( max * h / w );
			
			return { height : newH, width : max };
		}
		
		me.switchPop = function(){
			//var popup = $('#popup'),
			var	oldImg = me.popup.children('img, #pDesc, #pTitle').remove(),
				i = me.currentI,
				data = me.allData[i],
				maxHeight = $(window).height() - 80,
				maxWidth = $(window).width() - 40,
				imgHeight = data.height,
				imgWidth = data.width;
						
			//console.log('width', imgWidth, maxWidth );
			if ( imgWidth > maxWidth ) {
				var newImg = me.resizeWidth( imgHeight, imgWidth, maxWidth );
				imgHeight = newImg.height;
				imgWidth = newImg.width;
				//console.log('new width', newImg, imgWidth, maxWidth );
			}

			//console.log('height', imgHeight, maxHeight );
			if ( imgHeight > maxHeight ) {
				var newImg = me.resizeHeight( imgHeight, imgWidth, maxHeight );
				imgHeight = newImg.height;
				imgWidth = newImg.width;
			}
						
			var	imgData = {
					img : $('<img />', {
							src: data.src,
							height: imgHeight,
							width: imgWidth
						}).click(me.nextPop)
					//desc : $('<div />', { id: 'pDesc', html : data.desc})
					//title: $('<div />', { id: 'pTitle', html : data.title})
				};
			
			//add the title in if defined in the instance config
			if( me.showTitles )
				imgData.title = $('<div />', { id: 'pTitle', html : data.title});
			
			//same with description
			if( me.showDescriptions ){
				imgData.desc = $('<div />', { id: 'pDesc', html : data.desc});
			}
			
			for (var k in imgData) {
				me.popup.append( imgData[k] );
			}	
				
			me.positionPop();
		};
		
		me.makePopup = function(){			
			if (!me.popup){
				
				var controls = {
					nextBttn : $('<div />', { id: 'pNext', html: 'next' }).click(me.nextPop),
					prevBttn : $('<div />', { id: 'pPrev', html: 'prev' }).click(me.prevPop),
					closeBttn: $('<div />', { id: 'pClose', html: '&times;' }).click(me.closePop)
				};
				
				me.popup = $('<div />', { id: me.popupId }).click(function(e){ e.stopPropagation(); });
				
				for ( var ctrl in controls ) {
					me.popup.append( controls[ctrl] );
				}
				
				//popup.insertAfter(underlay);
				me.popup.prependTo('body');
			}
			
			me.switchPop();
		};
		


		me.init();
		
		$(window).resize(function(){
			if( me.popup && !me.popup.is(':hidden') )
				me.switchPop();
		});
		
		return ( me.galleryExists ? me : false );
	}
	
	window['EasePhotoGallery'] = EasePhotoGallery;
	
})(jQuery);


(function($){

	//google maps custom integration
	function EaseMap(config){
		//default configurable variables
		var me = this,
			defaults = {
				zoom: 4,
				//center on Salina kansas for good full us view
				centerLat: 38.7902935,
				centerLng: -97.64023729999997,
				mapHeight: 500,
				fitMarkers: false, //fit all the markers on the map?  overrides centerLatLng and zoom
				contId: 'gmapCont',
				dataCont: '.locationList',
				dataBlock: '.locationItem',
				dataAttr: 'location-data',
				locationKey: 'location_address',
				fallbackLocationKey: 'mailing_address',
				fallbackOverrideKey: false, //set as post meta to prefer the secondary address as the marker address
				markerImageKey: false,
				zoomControlStyle: 'DEFAULT',
				streetViewControl: false,
				scrollwheel: false,
				mapTypeId: 'ROADMAP',
				markerScale: 0.5,
				blocksAreClickable: false,
				scrollToMapOnClick: false,
				scrollSpeed: 500,
				directionsLink: false,
				globalInitID: 'EaseMapInit' //used to expose the setupConstants (used in init) function globally for googles async callback... change this to something unique for each instance running
			};
		for (var key in config) {
			defaults[key] = config[key] || defaults[key];
		}
		for (var key in defaults) {
			me[key] = defaults[key];
		}

		me.loadingGoogle = false;

		//here i am going to load the
		me.setupConstants = function(){
			if ( typeof google !== 'undefined' ) {

				//remove global access to this setup function
				if ( window[me.globalInitID] )
					window[me.globalInitID] = undefined;

				//constants
				me.loadingGoogle = false;

				me.infowindow = new google.maps.InfoWindow();

				me.directionsService = new google.maps.DirectionsService();
				//me.directionsDisplay = new google.maps.DirectionsRenderer({ suppressMarkers: true });
				me.directionsDisplay = new google.maps.DirectionsRenderer();
				//keep that map out of it for now.
				me.directionsDisplay.setMap( null );
				//geocoder used to take address and convert it to latLng and make marker
				me.geocoder = new google.maps.Geocoder();
				me.center = null;
				me.cont = null;
				me.map = null;
				me.form = null;
				me.startAddy = '';
				me.endAddy = '';
				me.currentRoute = null;
				me.confirmBttn = null;
				//me.waypoints = [];
				me.dblclickListener = null;

				me.data = [];
				me.markers = [];

				return me.init();

			} else {
				//console.log('no google');

				if (!me.loadingGoogle) {
					me.loadingGoogle = true;

					//make this setup function available globally
					window[me.globalInitID] = me.setupConstants;

					var script = document.createElement("script");
					script.type = "text/javascript";
					script.src = "http://maps.googleapis.com/maps/api/js?sensor=false&callback="+me.globalInitID;
					document.body.appendChild(script);
				}


			}
		};

		me.init = function(){
			//console.log('herro init', me, 'google', google);

			//gather data from page elements
			me.setupMarkerData();

			//console.log( 'data', me.data );

			//setup the map and initialize it.
			me.setupMap();

			//setup markers
			me.setupMarkers();

		};

		me.setupMap = function(){
			//find the container
			me.cont = document.getElementById( me.contId );

			//check dimensions
			if ( !$(me.cont).height() )
				$(me.cont).height( me.mapHeight );

			//console.log( 'me.cont', $(me.cont).width(), $(me.cont).height() );

			//set the google center
			me.center = new google.maps.LatLng( me.centerLat, me.centerLng );

			//get the map
			me.map = new google.maps.Map( me.cont, {
				center: me.center,
				zoom: me.zoom,
				zoomControlOptions: {
					style: google.maps.ZoomControlStyle[ me.zoomControlStyle ]
				},
				streetViewControl: me.streetViewControl,
				scrollwheel: me.scrollwheel,
				mapTypeId: google.maps.MapTypeId[ me.mapTypeId ]
			});

		};

		me.setupMarkers = function(){
			if ( me.data.length ) {
				//start bounds here for fitmarkers option later down
				var latLngBounds = new google.maps.LatLngBounds();

				//iterate through markers
				$.each(me.data, function(i){
					//console.log( i, this );

					var dataObj = this,
						address = ( me.fallbackOverrideKey && dataObj[ me.fallbackOverrideKey ] && dataObj[ me.fallbackLocationKey ] ?
										//if so, use the fallback key
										dataObj[ me.fallbackLocationKey ] :
										//otherwise, if there is no preference, try to use the primary key, and then fallback if it is not there
										dataObj[ me.locationKey ] || dataObj[ me.fallbackLocationKey ]
									);

					//console.log('dataObj', dataObj);

					if ( address ) {

						//console.log( 'address', address, me.stripTags( address ) );
						me.geocoder.geocode({

							address: me.stripTags( address )

						}, function(results, status){

							if (status === google.maps.GeocoderStatus.OK) {

								me.markers[i] = new google.maps.Marker({
									map: me.map,
									position: results[0].geometry.location,
									item: dataObj
								});

								//add a custom marker image?
								if ( me.markerImageKey && dataObj[ me.markerImageKey ] ){
									var img = dataObj[ me.markerImageKey ],
										src = img['src'],
										w = Math.floor( img.width * me.markerScale ),
										h = Math.floor( img.height * me.markerScale );

									me.markers[i].setIcon( new google.maps.MarkerImage(
																	//url
																	dataObj[ me.markerImageKey ].src,
																	//original image size ( width, height )
																	new google.maps.Size( w, h ),
																	//origin in image ( left, top ), (0,0) is google default
																	new google.maps.Point( 0, 0 ),
																	//anchor point
																	new google.maps.Point( w/2, h/2 ),
																	new google.maps.Size( w, h )
																)
									);

									w = null;
									h = null;
									src = null;
									img = null;
								}

								//bind the click listener
								//google.maps.event.addListener( me.markers[i], 'mousedown', me.handleMarkerClick );
								google.maps.event.addListener( me.markers[i], 'click', me.handleMarkerClick );

								//attach click handler to block if set
								if ( me.blocksAreClickable ) {

									$(dataObj.DOM).attr({ markerIndex: i }).mousedown( me.handleBlockClick ).find('a').click(me.preventBlockLinks);

								}

								if (me.fitMarkers) {
									//extend the auto bounds
									latLngBounds.extend( me.markers[i].position );
									me.map.fitBounds( latLngBounds );
								}

								//console.log( dataObj.DOM );
							} else {
								//something went wrong.
								alert("Geocode was not successful for the following reason: " + status);
							}
						});
					}

				});
			}
		};

		me.preventBlockLinks = function(e){
			e.preventDefault();
		};

		me.handleBlockClick = function(e){
			//find associated marker, and setup the coords like google does
			var marker = me.markers[ $(this).attr('markerIndex') ],
				coords = { latLng: marker.position };

			//console.log('me.handleBlockClick', e, this, marker, coords);
			me.handleMarkerClick.apply( marker, [coords] );

			//move page up to see map?
			if ( me.scrollToMapOnClick ){
				//finding the target element is not 'smart' (enough) right now, make it smarter later.
				var target = $(me.cont).closest('section'),
					off = target.offset(),
					//different browsers use different elements to calculate the scrolltop ( webkit=body, mozilla=html, par example )
					sTop = $('body').scrollTop() || $('html').scrollTop();

				if( sTop > off.top )
					$('html, body').stop(false, false).animate({ scrollTop: off.top }, me.scrollSpeed );

				target = null;
				off = null;
			}

			return;
		};

		me.handleMarkerClick = function(coords){
			//console.log('me.handleMarkerClick', coords, this);

			var content = '<div class="mapInfoDom">'+$(this.item.DOM).html();


			//here is where we print out a directions link
			if (me.directionsLink) {
				var addy = this.item[me.locationKey].replace(/ /g,'+').replace(/\n/g,',+'),
					//dUrl = 'http://maps.google.com/maps?saddr=&daddr='+addy+'&z=14'
					dUrl = 'http://maps.google.com/maps?saddr=&daddr='+addy

				//console.log( addy );

				content += '<a class="directionsLink" href="'+dUrl+'" title="Get directions to this site" target="_blank">Get Driving Directions</a>';
			}

			content += '</div>';

			//console.log( this.item.DOM );

			me.infowindow.setContent( content );

			me.infowindow.open(me.map, this);
		};


		me.setupMarkerData = function(){
			//dataBlock supplied in config
			return $(me.dataCont).find(me.dataBlock).each(function(){
				//console.log( $(this).attr( me.dataAttr ) );
				var item = JSON.parse( $(this).attr( me.dataAttr ) );
				item.DOM = this;
				me.data.push( item );
			});
		};

		//used to clean the address html for google.
		me.stripTags = function(s){
			//s = String
			if (typeof s !== 'string')
				return false;
			return s.replace(/<([^>]+)>/g,'').replace(/\n|\r/g,' ');
			//return s.replace(/\\n/g,'');
		};



		/*
		me.getRoute = function(){
			//console.log( 'me.getRoute', me.startAddy, me.endAddy, me.waypoints );
			me.directionsService.route({
				//origin: ttp.geo.userLocation,
				origin: me.startAddy,
				destination: me.endAddy,
				travelMode: google.maps.TravelMode.DRIVING,
				optimizeWaypoints: true,
				waypoints: me.waypoints
			}, me.directionsServiceCallback);
		};
		me.directionsServiceCallback = function(response, status){
			if (status == google.maps.DirectionsStatus.OK) {
				me.currentRoute = response.routes;
				//disable double click zoom when route is showing
				me.map.setOptions({ disableDoubleClickZoom: true });
				//console.log('directions gotten', response, me.currentRoute);
				//make a confirm button
				me.printConfirmBttn();
				//display the directions on the map
				me.directionsDisplay.setMap( me.map );
				me.directionsDisplay.setDirections(response);
			} else {
				//the directions couldn't be found for some reason, most likely cause there is no route, but could be server error
				//too many waypoints?
				if ( status == 'MAX_WAYPOINTS_EXCEEDED' ) {
					me.waypoints.pop();
					alert('Sorry, but you have provided as many waypoints as we can handle');
				} else {
					alert('Something went wrong fetching the directions: ' + status);
				}
				//me.currentRoute = null;
				//me.map.setOptions({ disableDoubleClickZoom: false });
			}
		};
		me.printConfirmBttn = function(){
			if ( !me.confirmBttn ) {
				me.confirmBttn = $('<button />', { id: 'add_commute_confirm', text: 'Route is correct' })
					.click(me.confirmClick)
					.insertBefore( me.cont );
			} else {
				me.confirmBttn.show();
			}
		};
		me.confirmClick = function(){
			//everything is alright, so submit the form
			//console.log('confirmation clicked', me.form.serialize(), me.waypoints );
			if ( me.waypoints.length )
				me.form.find('[name="waypoints"]').val( JSON.stringify( me.waypoints ) );
	              $.post(window.location.href, $('#add_commute_form').serialize())
		};
		*/

		me.setupConstants();
		return me;
	}

	window['EaseMap'] = EaseMap;

})(jQuery);
