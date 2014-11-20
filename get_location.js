$(document).ready(function () {
  initialize();
  getLocation();
  getmap();
  NProgress.configure({ showSpinner: false });
});
// HTML5 Geolocation : Find Current Location
var current_lat;
var current_long;

var city;
var state;

var amount_checks = 0;
var latlng;
var geocoder;
var check_time = new Date();
var check_initial = false;
var update_delay = 10000; // milliseconds

var custom = false;

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(currentPosition, handleError, {
      'enableHighAccuracy': true,
      'maximumAge': 30000
    });
  } else {
    $('#msg').html("Your browser does not support geolocation.");
  }
}

function handleError(error) {
  switch (error.code) {
  case error.PERMISSION_DENIED:
    $('#msg').html("Geolocation data not shared.");
    break;
  case error.POSITION_UNAVAILABLE:
    $('#msg').html("Could not detect current position.");
    break;
  case error.TIMEOUT:
    $('#msg').html("Retrieving position timed out.");
    break;
  default:
    $('#msg').html("Unknown Error.");
    break;
  }
}

function updateCoords(latitude, longitude) {
  current_lat = latitude;
  current_long = longitude;
}

function currentPosition(position) {
  current_lat = position.coords.latitude;
  current_long = position.coords.longitude;
  updateCoords(position.coords.latitude, position.coords.longitude);
  $('#lat').html('Latitude: ' + current_lat);
  $('#long').html('Longitude: ' + current_long);
  $('#msg').html(position.coords.accuracy + " meters of accuracy.");
  var now = new Date();
  var diff = now - check_time;
  if (!check_initial) {
    codeLatLng();
    check_initial = true;
    getmap();
    getData();
    NProgress.start();
  }
  if (diff > update_delay) {
    codeLatLng();
    check_time = now;
    getmap();
    getData();
  }
  amount_checks += 1;
  $('#checks').html('Checks: ' + amount_checks);
}

// Google Maps API : Show Current Location & Get Info

var infowindow = new google.maps.InfoWindow();
var current_zip;

function initialize() {
  geocoder = new google.maps.Geocoder();
  latlng = new google.maps.LatLng(40.75, -74);
}

function codeLatLng() {
  var lat = parseFloat(current_lat);
  var lng = parseFloat(current_long);
  
  latlng = new google.maps.LatLng(lat, lng);
  geocoder.geocode({
    'latLng': latlng
  }, function (results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      if (results[1]) {
        $('#name').html(results[1].formatted_address);
        city = findCity(results[0].address_components);
        state = findState(results[0].address_components);
        $("#citystate").html(city + ", " + state);
      } else {
        $('#msg').html('Google Maps: No results found for current location.');
      }
    } else {
      $('#msg').html('Google Maps Geocoder failed due to: ' + status);
    }
  });
}

function findCity(results) {
  for (var i in results) {
    if (results[i].types[0] == "locality") {
      $("#city").html(results[i].long_name);
      return results[i].long_name;
    }
  }
  return 0;
}

function findState(results) {
  for (var i in results) {
    if (results[i].types[0] == "administrative_area_level_1") {
      $("#state").html(results[i].short_name);
      return results[i].short_name;
    }
  }
  return 0;
}

function getmap() {
  $("#mastHead").css('background-image', 'linear-gradient(to right, rgba(0, 0, 0, 0.65),  rgba(0, 0, 0, 0.1)), url("https://maps.googleapis.com/maps/api/staticmap?center=' + current_lat + ',' + current_long + '&zoom=12&size=640x320&scale=2")');
}

function getData() {
  $.ajax({
    url: 'get_IG.php',
    type: 'POST',
    data: {
      latitude: current_lat,
      longitude: current_long
    },
    success: function (msg) {
      $("#instagram ul").html(msg);
	  NProgress.inc(0.3);
    }
  });

  $.ajax({
    url: 'get_yelp.php',
    type: 'POST',
    data: {
      latitude: current_lat,
      longitude: current_long
    },
    success: function (msg) {
      data = JSON.parse(msg);
      var return_data = "<ul>";
      var businesses = data["businesses"];
      for (var i in businesses) {
        var business = businesses[i];
        return_data += "<li class='cf'>" + "<div class='listings'>" + "<span class='text'>" + '<a target="_blank" href="' + business["url"] + '">' + business["name"] + '</a>' + "</span>" + "<span class='rating'>" + '<img src="' + business["rating_img_url"] + '"' + "/></span>" + "</div>" + "</li>";
      }
      return_data += "</ul>"
      $("#restaurants").html(return_data);
	  NProgress.inc(0.3);
	  NProgress.done();
    }
  });

  $.ajax({
	url: 'update_cache.php',
	type: 'POST',
	data: {
		latitude: current_lat,
		longitude: current_long,
		custom: custom
	},
	success: function(msg) {}
  });
}

function enableCustomLocation() {
	
}

function disableCustomLocation() {
	
}