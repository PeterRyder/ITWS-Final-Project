$(document).ready(function () {
  initialize();
  getLocation();
  getmap();
});

// HTML5 Geolocation : Find Current Location
var current_lat;
var current_long;
var amount_checks = 0;
var latlng;
var geocoder;
var check_time = new Date();
var check_initial = false;
var update_delay = 5000; // milliseconds

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

function currentPosition(position) {
  current_lat = position.coords.latitude;
  current_long = position.coords.longitude;
  $('#lat').html('Latitude: ' + current_lat);
  $('#long').html('Longitude: ' + current_long);
  $('#msg').html(position.coords.accuracy + " meters of accuracy.");
  var now = new Date();
  var diff = now - check_time;
  if (!check_initial) {
    codeLatLng();
    check_initial = true;
    getmap();
  }
  if (diff > update_delay) {
    codeLatLng();
    getValue(current_zip);
    check_time = now;
    getmap();
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
        var city = findCity(results[0].address_components);
        var state = findState(results[0].address_components);
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
  $("#mastHead").css('background-image', 'linear-gradient(to right, rgba(0, 0, 0, 0.65),  rgba(0, 0, 0, 0.1)), url("https://maps.googleapis.com/maps/api/staticmap?center=' + current_lat + ',' + current_long + '&zoom=12&size=1920x900")');
}
            
            