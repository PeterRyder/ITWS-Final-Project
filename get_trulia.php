<?php
// Input Data Example from JS
$zip_code = '12180';
// End
// Create session to store current ZIP code
session_start();
if (isset ($_SESSION['zip_code'])) {
	$zip_code = $_SESSION['zip_code'];
}
else {
	$_SESSION['zip_code'] = $zip_code;
}
function isNew($givenzipcode, $currentzip) {
	if ($givenzipcode == $currentzip) {
		return false;
	}
	else {
		$_SESSION['zip_code'] = $givenzipcode;
		return $givenzipcode;
	}
}
function setZipCode($newzip) {
	$_SESSION['zipcode'] = $newzip;
}
if(isset($_POST['zipcode'])) {
	$new = isNew($_POST['zipcode'], $zip_code);
	if($new) $zip_code = $new;
}
$today = date('Y-m-d');
$fourmonths = strtotime('-3 months', time());
$fourmonths_date = new DateTime();
$fourmonths_date->setTimestamp($fourmonths);
$fourmonths_txt = $fourmonths_date->format('Y-m-d');
$trulia = "http://api.trulia.com/webservices.php?library=TruliaStats&function=getZipCodeStats&zipCode=". $zip_code . "&startDate=". $fourmonths_txt . "&endDate=" . $today . "&apikey=2btppwrdrtfmpk2rnmuy9kfa";
$xml = simplexml_load_string(file_get_contents($trulia));
$json = json_encode($xml);
$array = json_decode($json,TRUE);
// var_dump($array);
// 
//var_dump($array["response"]["TruliaStats"]["listingStats"]);

$oneBedroom = array();
$twoBedroom = array();
$threeBedroom = array();
$fourBedroom = array();



foreach ($array["response"]["TruliaStats"]["listingStats"] as $week) {
	foreach ($week as $listing) {
		//var_dump($listing);

		foreach ($listing["listingPrice"]["subcategory"] as $house) {

			//var_dump($house);

			if ($house["type"] == "1 Bedroom Properties") {
				array_push($oneBedroom, $house["averageListingPrice"]);
			}
			elseif ($house["type"] == "2 Bedroom Properties") {
				array_push($twoBedroom, $house["averageListingPrice"]);
			}
			elseif ($house["type"] == "3 Bedroom Properties") {
				array_push($threeBedroom, $house["averageListingPrice"]);
			}
			elseif ($house["type"] == "4 Bedroom Properties") {
				array_push($fourBedroom, $house["averageListingPrice"]);
			}

		}
	}
}

$avgOneBedroom = -1;
$avgTwoBedroom = -1;
$avgThreeBedroom = -1;
$avgFourBedroom = -1;

if (count($oneBedroom) != 0) {
	$avgOneBedroom = round(array_sum($oneBedroom)/count($oneBedroom));	
}

if (count($twoBedroom) != 0) {
	$avgTwoBedroom = round(array_sum($twoBedroom)/count($twoBedroom));
}

if (count($threeBedroom) != 0) {
	$avgThreeBedroom = round(array_sum($threeBedroom)/count($threeBedroom));
}

if (count($fourBedroom) != 0) {
	$avgFourBedroom = round(array_sum($fourBedroom)/count($fourBedroom));
}

$result = array();

array_push($result, $avgOneBedroom);
array_push($result, $avgTwoBedroom);
array_push($result, $avgThreeBedroom);
array_push($result, $avgFourBedroom);

//var_dump($result);

$final_result = json_encode($result);

echo $final_result;