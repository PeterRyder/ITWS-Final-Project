<?php

$latitude = "42.728412";
$longitude = "-73.691785";
$access = "39008.a99ef26.36ce1a29b53c4676b595121e094584fe";

$result = fetchData("https://api.instagram.com/v1/media/search?lat={$latitude}&lng={$longitude}&distance=3000&access_token={$access}");

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

// var_dump($result);

foreach($result->data as $post) {
	$image_url = $post->images->standard_resolution->url;
	if ($count < 4) {
?>
<div class="pure-u-1 pure-u-sm-1 pure-u-md-1-2">
    <li>
		<img src="<?php echo $image_url ?>" class="pure-u-1">
    </li>
</div>
<?php
	$count++;
	}
}
?>