<?php
@session_start();
$return=1;
if(!isset($_SESSION['user_id'])) 
{
    $_SESSION['user_id'] = time();
	$return=0;
}
if(isset($_GET["page"]))
{
	$page= preg_replace( '/[^a-z0-9 \.#-]/i', '-', $_GET["page"]);
	
	$date=getdate(time());
	$stats_file='stats/data/logs'.$date["year"].'_'.str_pad($date["mon"], 2, "0", STR_PAD_LEFT).'_'.str_pad($date["mday"], 2, "0", STR_PAD_LEFT).'.txt';
	$myfile = file_put_contents($stats_file, $_SERVER['REMOTE_ADDR']."|".$page."|".$_SESSION['user_id']."|".$return."\n", FILE_APPEND);
}else
{
	echo "you gotta give me a page, man..";
}
?>