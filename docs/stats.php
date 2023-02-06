<!doctype html>
<html>
<body>
<h1>Stats www.inverbindingblijven.nl</h1>
<form>from <input id="from" type="date" name="from"> to <input type="date" id="to" name="to"><input type="submit" value="go"></form>
<script>
	// set default
	document.getElementById("from").value=(new Date(Date.now()-(24*1000*60*60*31))).toISOString().split('T')[0];
	document.getElementById("to").value=(new Date()).toISOString().split('T')[0];
	var data=location.href.split("?");
	if(data.length>1)
	{
		var pairs=data[1].split("&");
		for(var i=0;i<pairs.length;i++)
		{
			var val=pairs[i].split("=");
			switch(val[0])
			{
				case "from":
					document.getElementById("from").value=val[1];
				break;
				case "to":
					document.getElementById("to").value=val[1];
				break;
			}
		}
	}
</script>
<style>
table {
  border-collapse: collapse;
  width: 100%;
}

th, td {
  text-align: left;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #D6EEEE;
}
td.unique
{
	 background-color: rgba(255,0,0,0.1);
}
</style>
<?php
// show the latest stats 30 days
	if(isset($_GET["from"]) && isset($_GET["from"]))
	{
		$from= strtotime($_GET['from'])+60*60*2; //date('Y-m-d', strtotime($_GET['from']));
		$to= strtotime($_GET['to'])+60*60*2; 
//		echo "displaying from: ".$from." to ".$to; 
		
		$data=[];
		$max=1;
		for($i=$from;$i<=$to;$i+=24*60*60)
		{
			$filename="stats/data/logs".date('Y_m_d', $i).".txt";
			if(file_exists($filename))
			{
				$nr=count(file($filename));
			}else
			{
				$nr=0;
			}
			array_push($data,$nr);
			if($nr>$max) $max=$nr;
		}
		$d=0;
		$b=500/(($to-$from)/(24*60*60));
		echo '<hr><svg width="500" height="100" style="width: 100%; height:100px;" viewBox="0 0 501 100" preserveAspectRatio="none">';
		for($i=$from;$i<=$to;$i+=24*60*60)
		{
			$x=500*(500/(500+$b))*(($i-$from)/($to-$from));
			$color='#eee';
			if(date('w', $i)==0)
			{
				$color='#ddd';
			}
			echo '<rect x="'.$x.'" y="0" width="'.($b-1).'" height="100" fill="'.$color.'"></rect>';
			$y=100*$data[$d]/$max;
			$d++;
			echo '<rect x="'.$x.'" y="'.(100-$y).'" width="'.($b-1).'" height="'.$y.'" fill="rgba(255,0,0,0.5)"></rect>';
		}
		echo '<line x1="500" y1="0" x2="500" y2="100" stroke="#eef"></line>';
		echo "</svg><hr>";
		
		// now show the details
		$data=[];
		$unique_visitors=[];
		$all_pages=[];
		for($t=$from;$t<=$to;$t+=24*60*60)
		{
			$filename="stats/data/logs".date('Y_m_d', $t).".txt";
			if(file_exists($filename))
			{
				$events=[];
				foreach(file($filename) as $line) 
				{
					$stuff=explode("|",$line);
					if(count($stuff)==4)
					{
						$o=[];
						for($i=0;$i<count($stuff);$i++)
						{
							//84.241.194.231|online-lezen.html-2|1667392752|1
							switch($i)
							{
								case 0:
									$o['ip']=$stuff[$i];
								break;
								case 1:
									$no_html=explode(".html",$stuff[$i]);
									$parts=explode("-",$no_html[0]);
									if(count($parts)<2)
									{
										$o['page']=$parts[0];
									}else
									{
										$o['page']=$parts[0]."-".$parts[1];
									}
									if($o['page']=="")
									{
										$o['page']="index";
									}
									
									if(!in_array($o['page'],$all_pages))
									{
										array_push($all_pages,$o['page']);
									}
								break;
								case 2: // user -id/start time
									$o['user-id']=$stuff[$i];
								break;
								case 3: // has user id.
									$o['unique']=$stuff[$i];
								break;
							}
						}
						array_push($events,$o);

					}
					
				
				}
				// all lines read!
				// go through events of that day to 
				// add a single line to data!
				// first count hits per page on THAT day.
				$hits_per_page=[];
				for($i=0;$i<count($all_pages);$i++)
				{
					$o=[];
					$o['visits']=0;
					$o['unique']=0;
					$hits_per_page[$all_pages[$i]]=$o;
				}
				for($i=0;$i<count($events);$i++)
				{
					$event=$events[$i];
					if(isset($event["page"]))
					{
						if(isset($hits_per_page[$event["page"]]))
						{
							$hits_per_page[$event["page"]]["visits"]++;
							if(isset($event["unique"]))
							{
								if($event["unique"]==0)
								{
									$hits_per_page[$event["page"]]["unique"]++;
								}
							}else
							{
								echo "<hr>sorry, event[unique] is not in: ";
								var_dump($event);
							}
						}else
						{
							echo "sorry, ".$event["page"]." does not appear to be in: ";
							var_dump($hits_per_page);
							echo "<hr>";
							
						}

					}
				}
				// ok put this in DATA!
				$o=[];
				$o["date"]=date('l d/m/Y', $t);
				$o["pages"]=$hits_per_page;
				array_push($data,$o);
			}
		}
		// now analyse the data to get visitors and unique visitors per page per date.
		echo "<table border=1><tr><th>Date</th><th>Visits</th><th>Unique visits</th>";
		foreach($all_pages as $key)
		{
			echo "<th colspan='2'>".$key."</th>";
		}
		echo "</tr>";
		for($i=0;$i<count($data);$i++)
		{
			$total_visits=0;
			$total_unique=0;
			foreach($all_pages as $key)
			{
				$hits=$data[$i]["pages"][$key];
				$total_visits+=$hits["visits"];
				$total_unique+=$hits["unique"];
			}
			echo "<tr>";
			echo "<td>".$data[$i]["date"]."</td>";
			echo "<td class='visits'>".$total_visits."</td>";
			echo "<td class='unique'>".$total_unique."</td>";
			foreach($all_pages as $key)
			{
				$hits=$data[$i]["pages"][$key];
				echo "<td class='visits'>";
				echo round(100*$hits["visits"]/$total_visits)."%";
				echo "</td><td class='unique'>";
				echo round(100*$hits["unique"]/$total_unique)."%";
				echo "</td>";
			}
			echo "</tr>";
		}
	}else
	{
		echo "select date range and press go";
	}
?>
</body>
</html>