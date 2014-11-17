<?php

$latitude = $_POST['latitude'];
$longitude = $_POST['longitude'];

$ywsid = "bDUYxwT3fwZ4bpL0tThuXg";

$result = fetchData("http://api.yelp.com/business_review_search?category=restaurants&lat={$latitude}&long={$longitude}&radius=25&num_biz_requested=100&ywsid={$ywsid}");

function fetchData($url){
     $ch = curl_init();
     curl_setopt($ch, CURLOPT_URL, $url);
     curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
     curl_setopt($ch, CURLOPT_TIMEOUT, 20);
     $result = curl_exec($ch);
     curl_close($ch); 
     return $result;
}

$count = 0;
$total = 0;
$result = json_decode($result);

echo $result;

?>

<?php


?>