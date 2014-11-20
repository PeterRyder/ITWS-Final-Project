<?php

// Used to get the session variable data and send 
// back to JQuery via AJAX

// Three variables: Latitude, Longitude, Custom Location Enabled/Disabled

// Check if session variables exist first, pull the data,
// send back. 


$get_lat = "";
$get_long = "";
$custom = false;

if (isset ($_SESSION['latitude'])) {
	$get_lat = $_SESSION['latitude'];
}

if (isset ($_SESSION['longitude'])) {
	$get_long = $_SESSION['longitude'];
}

if (isset ($_SESSION['custom'])) {
	$custom = $_SESSION['custom'];
}

$data = array(
	'latitude' => $get_lat,
	'longitude' => $get_long,
	'custom' => $custom
);

echo json_encode($data);


?>