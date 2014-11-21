$(document).ready(function () {
  initialize();
  getLocation();
  getmap();
  NProgress.configure({ showSpinner: false });

$("#customval").focus();

$("#submit").click(function(event) {
	event.preventDefault();
	enableCustomLocation();	
});
$("#customval").keypress(function(event) {
	if(event.which == 13) {
		event.preventDefault();
		enableCustomLocation();
	}
});
$("a#customlocation").click(function() {
	disableCustomLocation();
});

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
var zipcode = "12180";
var the_zipcoder;
var watchID;

function getLocation() {
  if (navigator.geolocation) {
    watchID = navigator.geolocation.watchPosition(currentPosition, handleError, {
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
	getZipCode();
    getmap();
    getData();
    NProgress.start();
  }
  if ((diff > update_delay) && (custom == false)) {
    codeLatLng();
    check_time = now;
	getZipCode();
    getmap();
    getData();
  }
  amount_checks += 1;
  $('#checks').html('Checks: ' + amount_checks);
}

// Google Maps API : Show Current Location & Get Info

var infowindow = new google.maps.InfoWindow();

function initialize() {
  geocoder = new google.maps.Geocoder();
  latlng = new google.maps.LatLng(40.75, -74);
  zipcoder = new google.maps.LatLng(40.75, -74); 
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
      return_data += "</ul>";
      $("#restaurants").html(return_data);
  	  NProgress.inc(0.3);
  	  NProgress.done();
    }
  });

  $.ajax ({
    url: 'get_trulia.php',
    type: 'POST',
    data: {zipcode : zipcode},
    success: function(msg) {
      result = JSON.parse(msg);
      //console.log(result);
      
      var return_data = "<ul>";
      var j = 1;
      for (var i in result) {
        var avg_input = result[i].toString();
        //console.log(avg_input);
        var avg = avg_input.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");

        if (j == 1) {
          	if (avg < 1) {
				return_data += "<li class='cf'>" + "<div class='listings'>" + j + " bedroom: No data available. </div>" + "</li>";
			}
			else return_data += "<li class='cf'>" + "<div class='listings'>" + j + " bedroom: $" + avg + "</div>" + "</li>";
        }
        else {
			if (avg < 1) {
				return_data += "<li class='cf'>" + "<div class='listings'>" + j + " bedrooms: No data available. </div>" + "</li>";
			}
			else return_data += "<li class='cf'>" + "<div class='listings'>" + j + " bedrooms: $" + avg + "</div>" + "</li>";
        }
        j += 1;
      }

      return_data += "</ul>";
      
      $('#truliaData').html(return_data);
    }
  });
}

function getZipCode() {
	var lat = parseFloat(current_lat);
	var lng = parseFloat(current_long);

	  zipcoder = new google.maps.LatLng(lat, lng);
	  geocoder.geocode({
	    'latLng': zipcoder
	  }, function (results, status) {
	    if (status == google.maps.GeocoderStatus.OK) {
	      if (results[1]) {
			zipcode = findZip(results[0].address_components);
	      } else {
	        $('#msg').html('Google Maps: No results found for current location.');
	      }
	    } else {
	      $('#msg').html('Google Maps Geocoder failed due to: ' + status);
	    }
	  });
}

function findZip(results) {
	for (var i in results) {
		if (results[i].types[0] == "postal_code") {
			return results[i].long_name;
		}
	}
	return 0;
}

function enableCustomLocation() {
	if (custom != true) {
		custom = true;
	}
	// Turn off glowing
	$("#customlocationform a i ").addClass("noglow");
	
	// Turn off HTML5 geolocation
	navigator.geolocation.clearWatch(watchID);
	
	input_zipcode = $("#customval").val();
	zipcode = input_zipcode;
	NProgress.start();
  $.ajax({
	url: 'latlongfromzip.php',
	type: 'POST',
	data: {
		zipcode: zipcode
	},
	dataType: "JSON",
	success: function(msg) {
		current_lat = msg.latitude;
		current_long = msg.longitude;
		codeLatLng();
		getZipCode();
		getmap();
		getData();
		NProgress.done();
	}
  });
	
}

function disableCustomLocation() {
	if (custom == true) {
		custom = false;
	}
	// Turn glowing back on 
	$("#customlocationform a i").removeClass("noglow");
	
	// Reload everything
	location.reload();
}


