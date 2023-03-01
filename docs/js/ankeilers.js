var alle_ankeilers=document.getElementsByClassName("animated-ankeiler");
var ankeilers=[];
console.log("ankeilers gevonden: "+alle_ankeilers.length);
for(var i=0;i<alle_ankeilers.length;i++)
{
	ankeilers.push({dom: alle_ankeilers[i],freq:1000+Math.random()*300,
	img2:alle_ankeilers[i].getElementsByClassName("img2")[0]
	});
}
animateAnkeilers();

createReadMoreButtons()

function createReadMoreButtons()
{
	// maak deze structuur aan het einde van de aankeiler class=readmore
/*							<div class="readmore-balk-zalm"></div>
						<div class="readmore-balk-zalm-opaque"></div>
						<div class="readmore-balk-zalm-knop">Lees meer...</div>
						*/
	var readmore=document.getElementsByClassName("readmore");
	for(var i=0;i<readmore.length;i++)
	{
		if(i%2==0)
		{
			var balk=document.createElement("div");
			balk.className="readmore-balk-zalm";
			readmore[i].appendChild(balk);
			var balk=document.createElement("div");
			balk.className="readmore-balk-zalm-opaque";
			readmore[i].appendChild(balk);
			var balk=document.createElement("div");
			balk.className="readmore-balk-zalm-button";
			balk.innerHTML="Lees meer... &raquo;";
			readmore[i].appendChild(balk);
		}else{
			var balk=document.createElement("div");
			balk.className="readmore-balk-bruin";
			readmore[i].appendChild(balk);
			var balk=document.createElement("div");
			balk.className="readmore-balk-bruin-opaque";
			readmore[i].appendChild(balk);
			var balk=document.createElement("div");
			balk.className="readmore-balk-bruin-button";
			balk.innerHTML="Lees meer... &raquo;";
			readmore[i].appendChild(balk);
		}
	}
}

function animateAnkeilers()
{
	var time=Date.now();
	for(var i=0;i<ankeilers.length;i++)
	{
		//console.log("animateAnkeilers"+time)
		var fade=2*(0.5+Math.sin(time/ankeilers[i].freq))/2;
		if(fade>1) fade=1;
		if(fade<0) fade=0;
		//console.log(fade);
		ankeilers[i].img2.style.opacity=fade;
	}
	window.requestAnimationFrame(animateAnkeilers);
}

