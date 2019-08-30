jQuery(function($)  {

	var maps = [];

	var styles = [
		// Style 0 
		[{"stylers":[{"hue":"#ff1a00"},{"invert_lightness":!0},{"saturation":-100},{"lightness":33},{"gamma":0.5}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#2D333C"}]}]
	];

	function Map(id, mapOptions){
		this.map = new google.maps.Map(document.getElementById(id), mapOptions);
		this.markers = [];
		this.infowindows = [];
	}

	function addMarker(mapId,location,index,contentstr,image){
        maps[mapId].markers[index] = new google.maps.Marker({
            position: location,
            map: maps[mapId].map,
			icon: {
				url: image
			}
        });

		maps[mapId].infowindows[index] = new google.maps.InfoWindow({
			content:contentstr
		});
		
		google.maps.InfoWindow.prototype.opened = true;
		google.maps.event.addListener(maps[mapId].markers[index], 'click', function() {

			if(infoWindow.opened){
			   infoWindow.opened = false;
			   maps[mapId].infowindows[0].open(maps[mapId].map, maps[mapId].markers[index]);
			}
			else{
			   maps[mapId].infowindows[0].close();
			   infoWindow.opened = true;
			   maps[mapId].infowindows[0].open(maps[mapId].map, maps[mapId].markers[index]);
			}
		});

		google.maps.InfoWindow.prototype.opened = false;
		infoWindow = new google.maps.InfoWindow();


    }

	function initialize(mapInst) {

		var lat = mapInst.attr("data-lat"),
			lng = mapInst.attr("data-lng"),
			newLat,
			newLang,
			myLatlng = new google.maps.LatLng(lat,lng),
			setZoom = parseInt(mapInst.attr("data-zoom")),
			mapId = mapInst.attr('id');

		var mapStyle = styles[parseInt(mapInst.data('style'),10)];
		var styledMap = new google.maps.StyledMapType(mapStyle,{name: "styledmap"});

		var mapOptions = {
			zoom: setZoom,
			disableDefaultUI: true,
			scrollwheel: false,
			zoomControl: true,
			streetViewControl: true,
			center: myLatlng
		};

		maps[mapId] = new Map(mapId, mapOptions);

		maps[mapId].map.mapTypes.set('map_style', styledMap);
  		maps[mapId].map.setMapTypeId('map_style');

		var i = 0;

		$('.marker[data-rel="'+mapId+'"]').each(function(){
			var loc = new google.maps.LatLng($(this).data('lat'), $(this).data('lng')),
				text = $(this).data('string'),
				image = $(this).data('image');
			$(this).data('i', i).data('map',mapId);
			addMarker(mapId,loc,i,text,image);
			i++;
		});
	 
	}

	$(window).on('load', function(){

		$('.map-wrapper').each(function(){
			initialize($(this));
		});

		var tempInfowindow;

		$('.scrollToMap').on('click', function() {
			let srollMapId = $(this).attr('data-scroll-map-id'),
				markerId = $(this).attr('data-marker-id');

			if(tempInfowindow) tempInfowindow.close();

			tempInfowindow = maps[srollMapId].infowindows[markerId];

			maps[srollMapId].infowindows[markerId].open(maps[srollMapId].map, maps[srollMapId].markers[markerId]);

			maps[srollMapId].map.setCenter(new google.maps.LatLng($(this).data('lat'), $(this).data('lng')));
		});

	});

});