
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
	/*scrollFunction2()*/
};

var socs = document.getElementsByClassName("soc");

function scrollFunction() {
	if (document.body.scrollTop > 75 || document.documentElement.scrollTop > 75) {
		document.getElementById("header").style.fontSize = "12px";
		//document.getElementById("nav").style.top = "35px";
		document.getElementById("article").style.paddingTop = "35px";
		document.getElementsByClassName("soc")[0].style.width = '28px';
		for (var i = 0; i < socs.length; i++) {
			socs[i].style.width = '28px';
		}
	} 
	else {
		/*if ($(window).width() <= 800) {
			document.getElementById("header").style.fontSize = "14px";
		}
		else {
			document.getElementById("header").style.fontSize = "16px";
		}*/
		document.getElementById("header").style.fontSize = "15px";
		//document.getElementById("nav").style.top = "65px";
		document.getElementById("article").style.paddingTop = "60px";
		for (var i = 0; i < socs.length; i++) {
			socs[i].style.width = '35px';
		}
	}
}

/*
function scrollFunction2() {
	if (document.body.scrollTop > 75 || document.documentElement.scrollTop > 75) {
		document.getElementById("textdefault").style.opacity = "0";
		document.getElementById("textscroll").style.opacity = "1";
	} 
	else {
		document.getElementById("textdefault").style.opacity = "1";
		document.getElementById("textscroll").style.opacity = "0";
	}
}
*/


/* 
//Back to top button script not needed for now 

//Get the button
var mybutton = document.getElementById("myBtn");
// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};
function scrollFunction() {
	if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
		mybutton.style.display = "block";
	} 
	else {
		mybutton.style.display = "none";
	}
}
// When the user clicks on the button, scroll to the top of the document
function topFunction() {
	document.body.scrollTop = 0;
	document.documentElement.scrollTop = 0;
}
*/