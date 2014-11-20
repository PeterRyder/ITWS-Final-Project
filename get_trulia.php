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
// var_dump($array["response"]["TruliaStats"]["listingStats"]);
$listOfAverages = array();
foreach ($array["response"]["TruliaStats"]["listingStats"] as $week) {
	foreach ($week as $listing) {
		if ($listing["listingPrice"]["subcategory"][0]["type"] == "All Properties") {
			array_push($listOfAverages, $listing["listingPrice"]["subcategory"][0]["averageListingPrice"]);
		}
	}
}
$totalAvg = round(array_sum($listOfAverages)/count($listOfAverages));
echo $totalAvg;