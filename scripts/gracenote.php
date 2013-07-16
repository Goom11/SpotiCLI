<?php
include("./php-gracenote/Gracenote.class.php");

$clientID = "6899968";
$clientTag = "85E94EE15A976FD9FBB1B7A1BE8EE809";

if (file_get_contents("userID.txt") == NULL) {
	$api = new Gracenote\WebAPI\GracenoteWebAPI($clientID, $clientTag); // If you already have a userID, you can specify as third parameter to constructor and skip this step.
	$userID = $api->register();
	file_put_contents("userID.txt", $userID);
} else {
	$userID = file_get_contents("userID.txt");
	$api = new Gracenote\WebAPI\GracenoteWebAPI($clientID, $clientTag, $userID);
}

$results = $api->searchTrack($_GET["artist"], $_GET["album"], $_GET["track"], Gracenote\WebAPI\GracenoteWebAPI::BEST_MATCH_ONLY);
echo json_encode($results);
?>