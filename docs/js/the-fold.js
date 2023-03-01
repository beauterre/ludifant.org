// layout script.
	var images=[];
	var start=Date.now();
	var rows=8;
	var srcs;
	var landscape_mode=null;
	var skip_ipad_random_resize=[];
	resize();
//	setTimeout(resize,150);
	window.addEventListener("resize",resize);
	animateImages();

	function getActualSize(o)
	{
		var rect=o.dom.getBoundingClientRect();
		o.x=rect.x;
		o.y=rect.y;
		o.w=rect.width;
		o.h=rect.height;
	}
	function resize()
	{

		start=Date.now()-10000;// reset the time!
		//console.log("resize");
		var window_w = (window.innerWidth > 0) ? window.innerWidth : document.documentElement.clientWidth;
		var window_h = (window.innerHeight > 0) ? window.innerHeight : document.documentElement.clientHeight;
		if(landscape_mode==null)
		{
			if(window_w>window_h) landscape_mode=true;
			else  landscape_mode=false;
		}else{
			if( (window_w>window_h && landscape_mode==false) 
					||
				(window_w<=window_h && landscape_mode==true)
				)
			{
				console.log("you changed landscape to portrait or otherwise, we will reload the page.");
				location.reload(false); // no need to reget everything.. now it will probably work.
			}
		}
		if(skip_ipad_random_resize.length!=0)
		{
			// this doesn't seem to work.
			// https://stackoverflow.com/questions/8898412/iphone-ipad-triggering-unexpected-resize-events
			// check if this is the ipad acting up, or if there is an ACTUAL resize..
			if(window_w == skip_ipad_random_resize[0] && 
			   window_h == skip_ipad_random_resize[1])
			   {
					return;
			   }
		}
		skip_ipad_random_resize[0]=window_w; // keep the values, to check if there is a need to resize at all.
		skip_ipad_random_resize[1]=window_h;
		// this is needed according to this article for iOs.
		// https://stackoverflow.com/questions/8898412/iphone-ipad-triggering-unexpected-resize-events

		var fold={dom:document.getElementById("fold")};
		getActualSize(fold);
		// remove any pictures
		for(var i=0;i<images.length;i++)
		{
			fold.dom.removeChild(images[i].dom);
		}
		images=[];
		if(window_w>window_h)
		{
			console.log("landscape layout");
		
			var w = fold.w;
			var foundit=false;
			var h,vierkant;
			
			for(rows=3;rows<=6 && foundit==false;rows++)
			{
				vierkant=w/rows;
				h = 2*vierkant;
				console.log("test "+rows+" height: "+h);
				if(h<(window_h-fold.y)) 
				{
					foundit=true;
					// stop searching
				}
			}
			console.log("height: "+h);
			fold.dom.style.height=(vierkant*2)+"px";
			var kader={dom:document.getElementById("kader")};
			kader.id="kader";
			kader.dom.style="block";
			kader.dom.style.height=h+"px";
			kader.dom.style.width=vierkant+"px";
			kader.dom.style.float="right";
			kader.dom.style.boxSizing="border-box";
			kader.dom.style.overflow="hidden"; // stops the lettering spilling over in rendermistake, strange, but true
			kader.innerHTML="";
			fold.dom.style.boxSizing="border-box";
			fold.dom.style.lineHeight="0px";
			// build up kader.
			var randje=document.createElement("div");
			kader.dom.appendChild(randje);
			kader.dom.style.position="relative";
			randje.style.position="absolute";
			randje.style.boxSizing="border-box";
			randje.style.top="0px";
			randje.style.bottom="0px";
			randje.style.left="15px";
			randje.style.right="0px";
			randje.style.padding="15px";
			randje.style.border="5px solid #fca";
			randje.style.background="#fff";
			randje.style.display="flex";
			randje.style.flexDirection="column";
			randje.style.justifyContent="space-evenly";


			var p=document.createElement("div");
			p.innerHTML="Over kwaliteit van leven &eacute;n sterven.";
			p.style.fontSize=h/13+"px";
			p.style.textAlign="center";
			p.style.lineHeight=h/16+"px";
			randje.appendChild(p);
			var img=document.createElement("img");
			img.src="img/handjes-vrijstaand.png";
			img.style.width="100%";
			randje.appendChild(img);
			var p=document.createElement("div");
			p.style.fontSize=h/13+"px";
			p.style.lineHeight=h/16+"px";
			p.style.textAlign="center";
			p.innerHTML="Intimiteit, liefde, angst, verdriet en blijdschap.";
			randje.appendChild(p);
			// now add the other things.
			console.log("rows:"+rows+" vierkant:"+vierkant);
			for(var i=0;i<(rows-2)*2;i++)
			{
				images[i]={dom:document.createElement("div")};
				images[i].dom.style.boxSizing="border-box";
				images[i].dom.style.display="inline-block";
				images[i].dom.style.margin="0";
				images[i].dom.style.width=vierkant+"px";
				images[i].dom.style.height=vierkant+"px";
				images[i].dom.style.position="relative";
				
				images[i].img1=document.createElement("img");
				images[i].img1.style.position="absolute";
				images[i].img1.style.top="0";
				images[i].img1.style.left="0";
				images[i].img1.style.width="100%";
				images[i].img1.style.height="100%";
				images[i].img2=document.createElement("img");
				images[i].img2.style.position="absolute";
				images[i].img2.style.top="0";
				images[i].img2.style.left="0";
				images[i].img2.style.width="100%";
				images[i].img2.style.height="100%";
				images[i].dom.appendChild(images[i].img1);
				images[i].dom.appendChild(images[i].img2);
				images[i].dom.addEventListener("click",clickImage);

				fold.dom.appendChild(images[i].dom);
			}
		}else
		{
			// we need to divide the vertical space into three rows first.
			console.log("portrait layout");
			console.log("fold.h="+fold.h);
			var normal_row_height=fold.h/3;
			var aantal_plaatjes=Math.floor(fold.w/normal_row_height);
			console.log("aantal plaatjes naast elkaar="+aantal_plaatjes);
			if(aantal_plaatjes<2)
			{
				// we need to divide unequally!
				aantal_plaatjes=2;
			}
			var vierkant=fold.w/aantal_plaatjes;
			var h=(fold.h-vierkant*2);
			while(h<100)
			{
				aantal_plaatjes++;
				vierkant=fold.w/aantal_plaatjes;
				h=(fold.h-vierkant*2);
			}
			// now we get TWO rows of images, and inbetween the HEIGHT of the kader is:
			var kader={dom:document.getElementById("kader")};
			kader.dom.style="inline-block";
			kader.dom.style.height=(fold.h-vierkant*2)+"px";
			kader.dom.style.width=fold.w+"px";
			kader.dom.style.boxSizing="border-box";
			kader.dom.style.overflow="hidden"; // stops the lettering spilling over in rendermistake, strange, but true
			kader.innerHTML="";
			var randje=document.createElement("div");
			kader.dom.appendChild(randje);
			kader.dom.style.position="relative";
			
			randje.style.position="absolute";
			randje.style.boxSizing="border-box";
			randje.style.top="0px";
			randje.style.bottom="10px";
			randje.style.left="0px";
			randje.style.right="0px";
			randje.style.padding="5px";
			randje.style.border="5px solid #fca";
			randje.style.background="#fff";
			randje.style.display="flex";
			randje.style.overflow="hidden"; // stops the lettering spilling over in rendermistake, strange, but true
			randje.style.flexDirection="row";
			randje.style.justifyContent="space-evenly";

			var fontSize=fold.w/25;
			var p=document.createElement("div");
			p.style.height=h-30+"px";
			p.style.lineHeight=h-30+"px";
			var span=document.createElement("span");
			span.style.display="inline-block";
			span.style.verticalAlign="middle";
			span.innerHTML="Over kwaliteit van leven &eacute;n sterven.";
			span.style.fontSize=fontSize+"px";
			span.style.textAlign="center";
			span.style.lineHeight=0.8*fontSize+"px";
			p.appendChild(span);
			randje.appendChild(p);
			var img=document.createElement("img");
			img.src="img/handjes-vrijstaand.png";
			img.style.height=(h-30)+"px"
			if(h-30>fold.w/3)
			{
				img.style.height=fold.w/3+"px";
				img.style.marginTop=(((h-30)-(fold.w/3))/2)+"px";
			}
			img.style.maxHeight=fold.w/3+"px";
			randje.appendChild(img);
			var p=document.createElement("div");
			p.style.height=h-30+"px";
			p.style.lineHeight=h-30+"px";
			var span=document.createElement("span");
			span.style.display="inline-block";
			span.style.verticalAlign="middle";
			span.style.fontSize=fontSize+"px";
			span.style.lineHeight=0.8*fontSize+"px";
			span.style.textAlign="center";
			span.innerHTML="Intimiteit, liefde, angst, verdriet en blijdschap.";
			p.appendChild(span);
			randje.appendChild(p);
			// now add the images.
			for(var i=0;i<aantal_plaatjes;i++)
			{
				var o={dom:document.createElement("div")};
				o.dom.style.boxSizing="border-box";
				o.dom.style.display="inline-block";
				o.dom.style.margin="0";
				o.dom.style.width=vierkant+"px";
				o.dom.style.height=vierkant+"px";
				o.dom.style.position="relative";				
				o.img1=document.createElement("img");
				o.img1.style.position="absolute";
				o.img1.style.top="0";
				o.img1.style.left="0";
				o.img1.style.width="100%";
				o.img1.style.height="100%";
				o.img2=document.createElement("img");
				o.img2.style.position="absolute";
				o.img2.style.top="0";
				o.img2.style.left="0";
				o.img2.style.width="100%";
				o.img2.style.height="100%";
				o.dom.appendChild(o.img1);
				o.dom.appendChild(o.img2);
				o.dom.addEventListener("click",clickImage);
				kader.dom.parentNode.insertBefore(o.dom,kader.dom);
				images.push(o);

				// insert after!
				var o={dom:document.createElement("div")};
				o.dom.style.boxSizing="border-box";
				o.dom.style.display="inline-block";
				o.dom.style.margin="0";
				o.dom.style.width=vierkant+"px";
				o.dom.style.height=vierkant+"px";
				o.dom.style.position="relative";
				
				o.img1=document.createElement("img");
				o.img1.style.position="absolute";
				o.img1.style.top="0";
				o.img1.style.left="0";
				o.img1.style.width="100%";
				o.img1.style.height="100%";
				o.img2=document.createElement("img");
				o.img2.style.position="absolute";
				o.img2.style.top="0";
				o.img2.style.left="0";
				o.img2.style.width="100%";
				o.img2.style.height="100%";
				o.dom.appendChild(o.img1);
				o.dom.appendChild(o.img2);
				fold.dom.appendChild(o.dom);
				o.dom.addEventListener("click",clickImage);
				images.push(o);
				
			}
		}
		startAnimateImages();
		
	}
	function clickImage(ev)
	{
		console.log("someone clicked image: "+ev.currentTarget);
		console.log(ev.currentTarget);
		var imgs=ev.currentTarget.getElementsByTagName("img");
		for(var i=0;i<imgs.length;i++)
		{
			var link=imgs[i].getAttribute("link");
			if(link!="")
			{
				location.href=link;
			}
		}
	}
	function randomise(a,b)
	{
		if(Math.random()<0.5) return -1;
		else return 1;
	}
	function getSemiRandomSources()
	{
		srcs=[];
		// set the sources randomly for ALL images.
		var srcs_always=[{url:"fold7.png",link:"online-lezen.html"},{url:"fold8.png",link:"zoeken-in-het-boek.html?met%20jezelf"}];
		var srcs_random=[{url:"fold1.png",link:""},{url:"fold2.png",link:""},{url:"fold3.png",link:""},{url:"fold4.png",link:""},{url:"fold5.png",link:""},{url:"fold6.png",link:""},{url:"fold9.png",link:""},{url:"fold10.png",link:""}];
		for(var i=0;i<srcs_always.length;i++)
		{
			srcs.push(srcs_always[i]);
		}
		srcs_random.sort(randomise);
		for(var i=0;i<images.length-srcs_always.length;i++)
		{
			srcs.push(srcs_random[i]);
		}
//		console.log(srcs);
		srcs.sort(randomise);
	}

	function startAnimateImages()
	{
		console.log("startAnimateImages");
		getSemiRandomSources();
		
		for(var i=0;i<images.length;i++)
		{
			if(images[i].img1.src=="")
			images[i].img1.src="img/"+srcs[i].url;
			images[i].img1.setAttribute("link",srcs[i].link);
			images[i].img1.style.opacity=1;
			if(images[i].img2.src=="")
			images[i].img2.src="img/"+srcs[i].url;
			images[i].img2.setAttribute("link",srcs[i].link);
			images[i].img2.style.opacity=1;
			console.log()
		}
		//animateImages();
	}

	function animateImages()
	{
		var t=Date.now()-start;
		var i;
		
		if(t>10000) // every two seconds
		{
			console.log("switch");
			t=0;
			start=Date.now();// reset the time!
			getSemiRandomSources();
			console.log("rows: "+rows+" ->"+srcs.length);
			for(i=0;i<images.length;i++)
			{
				if( images[i].img2.src != ("img/"+srcs[i].url) )
				{
					images[i].img2.src="img/"+srcs[i].url;
					images[i].img2.setAttribute("link",srcs[i].link);
					images[i].img2.opacity=0;
				}
			}
		}
		for(i=0;i<images.length;i++)
		{
				var opacity=t/3500;
				if(opacity>1) // top image is full opacity.
				{
					opacity=1;
					if(images[i].img1.src!=images[i].img2.src)
					{
						images[i].img1.src=images[i].img2.src; // will prevent the flicker.
					}
				}else
				{
					if(images[i].img2.src!="")
					images[i].img2.style.opacity=opacity; // change opacity of top image.
				}
			
		}
		window.requestAnimationFrame(animateImages);
	}

	