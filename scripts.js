
// Accordion menu script

var acc = document.getElementsByClassName("accordion");
var i;
acc[0].nextElementSibling.style.maxHeight = acc[0].nextElementSibling.scrollHeight + "px";

for (i = 0; i < acc.length; i++) {
	acc[i].addEventListener("click", function() {
		this.classList.toggle("active");
		var panel = this.nextElementSibling;
		if (panel.style.maxHeight) {
			panel.style.maxHeight = null;
		} 
		else {
			panel.style.maxHeight = panel.scrollHeight + "px";
		} 
	});
}


// When the user scrolls down 50px from the top of the document, resize the header's font size

window.onscroll = function() {
	scrollFunction()
	scrollFunction2()
};

function scrollFunction() {
	if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
		document.getElementById("header").style.fontSize = "10px";
		document.getElementById("nav").style.top = "30px";
		document.getElementById("article").style.paddingTop = "30px";
	} 
	else {
		document.getElementById("header").style.fontSize = "30px";
		document.getElementById("nav").style.top = "70px";
		document.getElementById("article").style.paddingTop = "70px";
	}
}

function scrollFunction2() {
	if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
		document.getElementById("textdefault").style.opacity = "0";
		document.getElementById("textscroll").style.opacity = "1";
	} 
	else {
		document.getElementById("textdefault").style.opacity = "1";
		document.getElementById("textscroll").style.opacity = "0";
	}
}


// Comment box script

var rb_owner_key = "1b94e84a-8979-11eb-9664-040140774501";
var thread_uri = window.location.href;
var thread_title = window.document.title;
var thread_fragment = window.location.hash;

// rb owner was here.
var rb_src = "https://my.remarkbox.com/embed" + 
	"?rb_owner_key=" + rb_owner_key +
	"&thread_title=" + encodeURI(thread_title) +
	"&thread_uri=" + encodeURIComponent(thread_uri) + 
	thread_fragment;

function create_remarkbox_iframe() {
	var ifrm = document.createElement("iframe");
	ifrm.setAttribute("id", "remarkbox-iframe");
	ifrm.setAttribute("scrolling", "no");
	ifrm.setAttribute("src", rb_src);
	ifrm.setAttribute("frameborder", "0");
	ifrm.setAttribute("tabindex", "0");
	ifrm.setAttribute("title", "Remarkbox");
	ifrm.style.width = "75%";
	document.getElementById("remarkbox-div").appendChild(ifrm);
}
create_remarkbox_iframe();
iFrameResize(
{
	checkOrigin: ["https://my.remarkbox.com"],
	inPageLinks: true,
	initCallback: function(e) {e.iFrameResizer.moveToAnchor(thread_fragment)}
},
document.getElementById("remarkbox-iframe")
);


/* 
//Back to top button script not needed for now 

<script>
	//Get the button
	var mybutton = document.getElementById("myBtn");
	// When the user scrolls down 20px from the top of the document, show the button
	window.onscroll = function() {scrollFunction()};
	function scrollFunction() {
		if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
			mybutton.style.display = "block";
		} else {
			mybutton.style.display = "none";
		}
	}
	// When the user clicks on the button, scroll to the top of the document
	function topFunction() {
		document.body.scrollTop = 0;
		document.documentElement.scrollTop = 0;
	}
</script>
*/