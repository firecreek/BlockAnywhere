/**
* Distance JavaScript
*
* Credits :
* - jQuery
* - distance calculation from http://www.movable-type.co.uk/scripts/latlong.html
*
* Firecreek Co. Ltd.
* http://www.firecreekweb.com
*/

/**
* Distance Class
*/
var Distance = {
  currentCoords : '',
  watching      : false
}

/**
* function initialize
* - initialize the script
*
* @return void
*/
Distance.init = function() {
  // check browser support geolocation
  if(navigator.geolocation) {
    Distance.watching = true;
    navigator.geolocation.watchPosition(function (position) {
      // get current lat/lng
      Distance.currentCoords = position.coords;

      Distance.updateAll();
    },function(error){},{timeout:10000});
  }

  $(function() {
    Distance.updateAll();
  })
}

/**
* function updateAll
* - show distance value to the target element
* 
* @return void
*/
Distance.updateAll = function() {
  if(!Distance.currentCoords) {
    var msg = 'no distance found';
    if(Distance.watching) { msg = 'loading'; }

    $("[data-with-distance]").each(function() {
      $(".distance",this).html(msg);
    });
    return;
  }

  originLat = Distance.currentCoords.latitude;
  originLng = Distance.currentCoords.longitude;

  $("[data-with-distance]").each(function(i, v) {
    destinationLat = $(v).data('lat');
    destinationLng = $(v).data('lng');

    distance = Distance.calculateDistance(destinationLat, destinationLng, originLat, originLng);

    $(".distance",this).html('about '+distance+' km');
  });
}


/**
* function calculateDistance
* - calculate distance between 2 lat/lng
*
* @param Float destinationLat - destination latitude
* @param Float destinationLng - destination longitude
* @param Float originLat - start latitude
* @param Float originLng - start longitude
* @return void
*/
Distance.calculateDistance = function(destinationLat, destinationLng, originLat, originLng) {
  // earth radius km
  var R = 6371;
  var originLat = originLat;
  var originLng = originLng;

  var dLat = Distance.toRad(destinationLat-originLat);
  var dLng = Distance.toRad(destinationLng-originLng);
  var originLat = Distance.toRad(originLat);
  var destinationLat = Distance.toRad(destinationLat);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLng/2) * Math.sin(dLng/2) * Math.cos(originLat) * Math.cos(destinationLat); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c;

  return Math.round(d);
}

/**
* function calculateDistance
* - calculate distance to radius
*
* @param Float num
* @return Float num
*/
Distance.toRad = function(num) {
  return num * Math.PI / 180;
}
