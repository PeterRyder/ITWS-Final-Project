<?php

$data = "http://api.usatoday.com/open/census/pop?keypat=NY&sumlevid=4,6&api_key=uh4gvjvrwfg3342f395kwbd9";

$latitude = $_POST['latitude'];
$longitude = $_POST['longitude'];
$city = $_POST['city'];
$state = $_POST['state'];

echo $latitude.$longitude.$city.$state;


?>