<?php
$sid = $_GET['summonerID'];
$api_key = "ef97109d-5c86-4467-a021-45c4d36fdf86";
$jsonurl = "https://na.api.pvp.net/observer-mode/rest/consumer/getSpectatorGameInfo/NA1/".$sid."?api_key=".$api_key;
$json = file_get_contents($jsonurl);
if (isJson($json)){
echo $json;
}
else{
echo "Could not find current game info.";
}

function isJson($string) {
  return substr($string,0,1) == "{";
}
?>