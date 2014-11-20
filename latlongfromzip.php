<?php

$zipcode = $_POST['zipcode'];

$result = fetchData("http://maps.googleapis.com/maps/api/geocode/json?address={$zipcode}");

function fetchData($url){
     $ch = curl_init();
     curl_setopt($ch, CURLOPT_URL, $url);
     curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
     curl_setopt($ch, CURLOPT_TIMEOUT, 20);
     $result = curl_exec($ch);
     curl_close($ch); 
     return $result;
}

$result = json_decode($result);
$status = $result->status;

if ($status == "OK") {
	// We found a lat/long pair for the zipcode.
	$converted_lat = $result->results[0]->geometry->location->lat;
	$converted_lng = $result->results[0]->geometry->location->lng;
	$location = array("latitude" => $converted_lat, "longitude" => $converted_lng);
	$location = json_encode($location);
	echo $location;
}


?>