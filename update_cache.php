<?php

$latitude = $_POST['latitude'];
$longitude = $_POST['longitude'];

session_start();

if (isset ($_SESSION['latitude'])) {
	$_SESSION['latitude'] = $latitude;
}
if (isset ($_SESSION['longitude'])) {
	$_SESSION['longitude'] = $longitude;
}


?>