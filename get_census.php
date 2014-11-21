<?php

$city = $_POST['city'];
$state = $_POST['state'];
// 
// $city = "Troy";
// $state = "NY";

$printed = 0;

// POPULATION DATA

$popData = fetchData("http://api.usatoday.com/open/census/pop?keypat={$state}&sumlevid=4,6&api_key=uh4gvjvrwfg3342f395kwbd9");

function fetchData($url){
     $ch = curl_init();
     curl_setopt($ch, CURLOPT_URL, $url);
     curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
     curl_setopt($ch, CURLOPT_TIMEOUT, 20);
     $result = curl_exec($ch);
     curl_close($ch); 
     return $result;
}

$popData = json_decode($popData);
$population = "0";

foreach($popData->response as $place) {
	if (($place->Placename) == $city) $population = $place->Pop;
}

if (intval($population) > 0) {
	$population_number = intval($population);
	$population_string = number_format($population_number);
	
?>
	<li>Population: <span><?php echo $population_string; ?></span></li>
<?php
$printed++;
}


// ETHNICITY DATA

$ethData = fetchData("http://api.usatoday.com/open/census/eth?keypat={$state}&sumlevid=4,6&api_key=uh4gvjvrwfg3342f395kwbd9");

$ethData = json_decode($ethData);
$ethIndex = "0";

foreach ($ethData->response as $place) {
	if (($place->Placename) == $city) {
		$ethIndex = $place->USATDiversityIndex;
	}
}

if (floatval($ethIndex) > 0) {
	$ethIndex_number = floatval($ethIndex);
	$ethIndex_string = $ethIndex;
?>
	<li>USA Today Ethnicity Index: <span><?php echo $ethIndex_string; ?></span></li>
<?php
	$printed++;
}







if ($printed == 0) echo "<li>No data available.</li>";




?>