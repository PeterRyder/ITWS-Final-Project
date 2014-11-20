<?php

// $zipcode = $_POST['zipcode'];
$zipcode = "95131";

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

echo $result->{'results'};

?>