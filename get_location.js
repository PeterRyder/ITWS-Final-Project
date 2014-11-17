$(document).ready(function () {
  initialize();
  getLocation();
  getmap();
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
  $("#mastHead").css('background-image', 'linear-gradient(to right, rgba(0, 0, 0, 0.65),  rgba(0, 0, 0, 0.1)), url("https://maps.googleapis.com/maps/api/staticmap?center=' + current_lat + ',' + current_long + '&zoom=12&size=2000x2000")');
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
      var return_data = "<ul>";

      var businesses = data["businesses"];

      for (var i in businesses) {
        var business = businesses[i];

        return_data += "<li>" + "<div class='listings'>" + "<span class='text'>" + '<a target="_blank" href="' + business["url"] + '">' + business["name"] + '</a>' + "</span>" + "<span class='rating'>" + " Rating: " + '<img src="' + business["rating_img_url"] + '"' + "</span>" + "</div>" + "</li>";
      }

      return_data += "</ul>"

      $("#restaurants").html(return_data);
    }
  });

}


// 
// function getYelp() {
//   var auth = {
//     //
//     // Update with your auth tokens.
//     //
//     consumerKey: "6bYY1U8dhgFt17noBW5NXQ",
//     consumerSecret: "LXEV5iVj-Azb12ub7G8kaFWpK5Q",
//     accessToken: "tX6UzxaDaewFyriSB902mFFs4EDUF6Lx",
//     // This example is a proof of concept, for how to use the Yelp v2 API with javascript.
//     // You wouldn't actually want to expose your access token secret like this in a real application.
//     accessTokenSecret: "YpjvnyGiU5JRb6RaPrl0LmmVTjg",
//     serviceProvider: {
//       signatureMethod: "HMAC-SHA1"
//     }
//   };
// 
//   var accessor = {
//     consumerSecret: auth.consumerSecret,
//     tokenSecret: auth.accessTokenSecret
//   };
// 
//   parameters = [];
//   parameters.push(['callback', 'cb']);
//   parameters.push(['oauth_consumer_key', auth.consumerKey]);
//   parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
//   parameters.push(['oauth_token', auth.accessToken]);
//   parameters.push(['oauth_signature_method', 'HMAC-SHA1']);
// 
//   var message = {
//     'action': 'http://api.yelp.com/v2/search?term=restaurants&location=' + city + '+' + state + '&limit=10',
//     'method': 'GET',
//     'parameters': parameters
//   };
// 
//   OAuth.setTimestampAndNonce(message);
//   OAuth.SignatureMethod.sign(message, accessor);
//   var parameterMap = OAuth.getParameterMap(message.parameters);
//   parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature);
// 
//   $.ajax({
//     'url': message.action,
//     'data': parameterMap,
//     'cache': true,
//     'dataType': 'jsonp',
//     'jsonpCallback': 'cb',
//     'success': function (data, textStats, XMLHttpRequest) {
// 
//       var return_data = "<ul>";
// 
//       var businesses = data["businesses"];
// 
//       for (var i in businesses) {
//         var business = businesses[i];
// 
//         return_data += "<li>" + "<div class='listings'>" + "<span class='text'>" + '<a target="_blank" href="' + business["url"] + '">' + business["name"] + '</a>' + "</span>" + "<span class='rating'>" + " Rating: " + '<img src="' + business["rating_img_url"] + '"' + "</span>" + "</div>" + "</li>";
//       }
// 
//       return_data += "</ul>"
// 
//       $("#restaurants").html(return_data);
// 
//     }
//   }); 
// }

