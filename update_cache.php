<?php

// IF CUSTOM IS TRUE, disregard the information being given
// by AJAX.

$latitude = $_POST['latitude'];
$longitude = $_POST['longitude'];
$custom = $_POST['custom'];

session_start();

if (isset($_SESSION['custom'])) {
	
}

if (isset ($_SESSION['latitude'])) {
	$_SESSION['latitude'] = $latitude;
}
if (isset ($_SESSION['longitude'])) {
	$_SESSION['longitude'] = $longitude;
}


?>