

// disable context menu
document.oncontextmenu = function(e){
 stopEvent(e);
}
function stopEvent(event){
 if(event.preventDefault != undefined)
  event.preventDefault();
 if(event.stopPropagation != undefined)
  event.stopPropagation();
}

// get the basepath for the links.
var basepath="";
if(location.href.indexOf("docs")!=-1)
{
	// local basepath, no localhost needed.
	basepath=location.href.split("docs/")[0]+"docs/";
}else{
	if(location.href.indexOf("https://hjalmarsnoep.github.io/")!=-1)
	{
		// github pages version for fast feedback and development fork.
		basepath="https://hjalmarsnoep.github.io/www.inverbindingblijven.nl/";
		
	}else{
		// normal online, live basepath!
		basepath="https://www.inverbindingblijven.nl/";
	}
}

// do the stats
const stats = new XMLHttpRequest();
stats.addEventListener("load", reqListener);
var path = window.location.pathname;
var page = path.split("/").pop();

stats.open("GET", "stats.php?page="+page+"&hash="+location.hash);
stats.send();
function reqListener()
{
	console.log("stats.php?page="+page+"&hash="+location.hash);
}

// set up the menu.

var menu=[];
menu.push(
			{name: "Home", link: basepath+"index.html"},
			{name: "Het boek",
				sub:[
						{name: "In verbinding blijven",link: basepath+"het-boek-in-verbinding-blijven.html"},
						{name: "Boek-online lezen",link: basepath+"online-lezen.html"}
		//				{name: "Sheets",link: basepath+"lezingen/sheets.html"},
					]
			},
			{name: "Kernwaarden", 
				sub:[
				{name: "Haptonomie",link: basepath+"haptonomie-en-het-emotionele-kompas.html"},
				{name: "Aanraken",link: basepath+"het-innerlijke-medicijn-van-aanraken.html"},
				{name: "Zachte zorg",link: basepath+"zachte-zorg-creeert-eigen-regie.html"},
				{name: "Kwaliteit van leven",link: basepath+"kwaliteit-van-leven-in-fase-palliatief.html"},
				{name: "Kwetsbaarheid",link: basepath+"kwetsbaarheid-tonen-maakt-sterk.html"},
				{name: "Kwaliteit van sterven",link: basepath+"kwaliteit-van-sterven-in-fase-terminaal.html"},
				{name: "Ik ben er nog",link: basepath+"kwaliteit-van-sterven-in-fase-terminaal.html#ik-ben-er-nog"}
//				,
//				{name: "Seminar", link: basepath+"seminar-verbinding-bij-kanker.html"}
				]
			},
			{name: "Seminar", link: basepath+"seminar-verbinding-bij-kanker.html"}
//			{name: "Over deze site",link: basepath+"over/about.html"},
//			{name: "Contact",link: basepath+"contact/contact.html",
//				sub:[
//						{name: "Seminar boeken",link: basepath+"seminar-verbinding-bij-kanker.html#boeken"},			
//						{name: "Reacties",link:  basepath+"contact/contact.html"}
//					]
			
//			},
		);

var hamburgerIcon='<svg style="width: 7.5vh; heigth: 7.5vh;" viewBox="0 0 50 50">';
	hamburgerIcon+=	'<rect x="10" y="10" width="30" height="3" fill="#625658"/>';
	hamburgerIcon+=	'<rect x="10" y="20" width="30" height="3" fill="#625658"/>';
	hamburgerIcon+=	'<rect x="10" y="30" width="30" height="3" fill="#625658"/>';
	hamburgerIcon+=	'<text x="5" y="50" width="30" height="12" fill="#625658">menu</text>';
	hamburgerIcon+='</svg>';
var closeIcon='<svg style="width: 7.5vh; heigth: 7.5h;" viewBox="0 0 50 50">';
	closeIcon+=	'<line x1="15" y1="10" x2="35" y2="30" stroke="#625658" stroke-width="3" />';
	closeIcon+=	'<line x1="35" y1="10" x2="15" y2="30" stroke="#625658" stroke-width="3" />';
	closeIcon+=	'<text x="0" y="50" width="30" height="12" fill="#625658">sluiten</text>';
	closeIcon+='</svg>';

var mobileMenuButton="",hiddenitems;
createLandscapeMenu();
createCollapsibleMenu();
createFooter();

function createFooter()
{
	var footer=document.createElement("div");
	footer.id="footer";
	document.body.appendChild(footer);
	footer.innerHTML="&copy; Copyright alle beelden en tekst: Hans Snoep";
}

function closeMobileMenu()
{
	mobileMenuButton.addEventListener("click",openMobileMenu);
	mobileMenuButton.removeEventListener("click",closeMobileMenu);
	mobileMenuButton.innerHTML=hamburgerIcon;
	hiddenitems.style.height="0";
}
function openMobileMenu()
{
	// we need to close all the sub-menus and set their openheight

	var subs=document.body.getElementsByClassName("mobile-menu-item-has-sub");
	for(var i=0;i<subs.length;i++)
	{
		var hide=subs[i].getElementsByClassName("hide-mobile-sub");
		var the_hider=hide[0];
		var rect=the_hider.getBoundingClientRect();
		console.log("rect"+JSON.stringify(rect));
		the_hider.setAttribute("open-height",rect.height+10);
		the_hider.style.height="0";
	}

	
	mobileMenuButton.removeEventListener("click",openMobileMenu);
	mobileMenuButton.addEventListener("click",closeMobileMenu);
	mobileMenuButton.innerHTML=closeIcon;
	hiddenitems.style.height="100vh";
}
function createCollapsibleMenu()
{
	console.log("createCollapsibleMenu")
	var nav=document.createElement("nav");
	nav.className="mobile-navigation";
	var button=document.createElement("div");
	var window_h = (window.innerHeight > 0) ? window.innerHeight : document.documentElement.clientHeight;
	var vh=window_h/100;

	button.style.width="10vh";
	button.style.display="inline-block";
	button.style.height="10vh";
	button.innerHTML=hamburgerIcon;
	mobileMenuButton=button;
	nav.appendChild(button);
	button.addEventListener("click",openMobileMenu);
	
	var ul=document.createElement("div");
	hiddenitems=ul;
	ul.style.height="0";
	ul.id="hide-mobile-menu";
	nav.appendChild(ul);
	for(var i=0;i<menu.length;i++)
	{
		var li=document.createElement("div");
		li.className="mobile-menu-normal-item";
		ul.appendChild(li);
		// measure it to get an accurate open-height.
		
//		console.log(menu[i].link+"=="+location.href+"?");
		if(menu[i].link==location.href)
		{
			li.className="mobile-menu-normal-item active";
		}
		
		if(typeof(menu[i].sub)!=="undefined")
		{	
			// create submenu.
			li.innerHTML=menu[i].name+" &dtrif;";
			li.setAttribute("target","mobile_sub_"+i);
			li.className="mobile-menu-item-has-sub";
			ul_sub=createMobileSub(menu[i].sub);
			li.addEventListener("click", expandMobileSub);
			li.appendChild(ul_sub);
		}else{
				// create item.
			var a=document.createElement("a");
			li.appendChild(a);
			a.innerHTML=menu[i].name;
			a.href=menu[i].link;
		}
		var rect=ul.getBoundingClientRect();
		ul.setAttribute("open-height",rect.height);
	}
	
	
	document.body.appendChild(nav);
	// is empty for now.
	
	// landscape!
/*			console.log(" landscape ");
			var mobile_menu={dom:document.getElementById("collapsible-menu")};
			mobile_menu.dom.style.display="none";
			var menu={dom:document.getElementById("menu-bar")};
			menu.dom.style.display="block";
			getActualSize(menu);*/
	
}
function expandMobileSub(ev)
{
	// close all!
	var all=document.getElementsByClassName("hide-mobile-sub");
	for(var i=0;i<all.length;i++) all[i].style.height="0px";
	var hider=ev.currentTarget.getElementsByClassName("hide-mobile-sub");
	if(hider.length!=0)
	{
		hider[0].style.height=hider[0].getAttribute("open-height")+"px";
	}else
	{
		console.log("Error! no hider?");
	}
}
function openLandScapeMenu(ev)
{
	console.log(ev.currentTarget);
	var target=ev.currentTarget.getAttribute("open_target");
	var sub=document.getElementById(target);
	var subs=document.getElementsByClassName("landscape_submenu");
	for(var i=0;i<subs.length;i++)
	{
		if(subs[i]==sub && sub.style.display!="block")
		{
			console.log("OPEN: ");
			console.log(sub);
			sub.style.display="block";
			sub.style.visibility="visible";
			sub.style.opacity="1";
		}else{
			console.log(subs[i]);
			subs[i].style.display="none";
			subs[i].style.visibility="hidden";
			subs[i].style.opacity="0";
			// close all subs but the sub you clicked on..
		}
	}
}
function createLandscapeMenu()
{
	// get the active page from the location
	
	
	var nav=document.createElement("nav");
	nav.className="primary-navigation";
	nav.setAttribute("role","navigation");
	document.body.appendChild(nav);
	
	var ul=document.createElement("ul");
	nav.appendChild(ul);
	for(var i=0;i<menu.length;i++)
	{
		var li=document.createElement("li");
		var a=document.createElement("a");
		li.appendChild(a);
//		console.log(menu[i].link+"=="+location.href+"?");
		if(menu[i].link==location.href)
		{
			li.className="active";
		}
		
		if(typeof(menu[i].sub)!=="undefined")
		{	
			// create submenu.
			a.innerHTML=menu[i].name+" &dtrif;";
			//a.href=menu[i].link;
			ul_sub=createLandscapeSub(menu[i].sub);
			ul_sub.id="sub_"+i;
			ul_sub.className="landscape_submenu";
			li.setAttribute("open_target",ul_sub.id);
			li.appendChild(ul_sub);
			li.addEventListener("click",openLandScapeMenu);
		}else{
				// create item.
			a.innerHTML=menu[i].name;
			a.href=menu[i].link;
		}
		ul.appendChild(li);
	}
}
function createLandscapeSub(data)
{
	var ul=document.createElement("ul");
	ul.className="dropdown";
	for(var i=0;i<data.length;i++)
	{
		var li=document.createElement("li");
		
		var a=document.createElement("a");
		li.appendChild(a);		
		if(data[i].link==location.href)
		{
			li.className="active";
		}
		a.innerHTML=data[i].name;
		a.href=data[i].link;
		ul.appendChild(li);
	}
	return ul;
}

function createMobileSub(data)
{
	var ul=document.createElement("div");
	ul.className="hide-mobile-sub";
	ul.style.height="100%";
	for(var i=0;i<data.length;i++)
	{
		var li=document.createElement("div");
		li.className="mobile-menu-normal-item";
		var a=document.createElement("a");
		li.appendChild(a);		
		if(data[i].link==location.href)
		{
			li.className="mobile-menu-normal-item active";
		}
		a.innerHTML=data[i].name;
		a.href=data[i].link;
		ul.appendChild(li);
	}
	return ul;
}

/*
<nav role="navigation" class="primary-navigation">
  <ul>
    <li><a href="#">In verbinding blijven &dtrif;</a>
      <ul class="dropdown">
        <li><a href="#">Boek</a></li>
        <li><a href="#">Sheets</a></li>
        <li><a href="#">Audioboek</a></li>
        <li><a href="#">Lezingen</a></li>
      </ul>
    </li>
    <li><a href="#">Over deze site</a></li>
    <li><a href="#">Contact</a></li>
  </ul>
</nav>
*/
