<?php

$city = $_POST['city'];
$state = $_POST['state'];

$result = fetchData("http://api.usatoday.com/open/census/pop?keypat={$state}&sumlevid=4,6&api_key=uh4gvjvrwfg3342f395kwbd9");

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

$population = "0";

foreach($result->response as $place) {
	if (($place->Placename) == $city) $population = $place->Pop;
}

if (intval($population) > 0) {
	$population_number = intval($population);
	$population_string = number_format($population_number);
	echo $population_string;
}
else echo "Data not available.";

?>