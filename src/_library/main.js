/***
 * main.js für stumpp labor
 * 
 *
 */
 
 
/* das sind die beiden Buttons oben links im Header */
const buttonLogin = document.getElementById('layoutLogin');
let statusLogin = 0;

/*** initialization on document ready ***/

document.addEventListener("DOMContentLoaded", function(event) {

	if (buttonLogin) {
		setLucideStroke(buttonLogin, 'transparent', 1);
		buttonLogin.addEventListener('click', loginUser);
		setLucideStroke(buttonLogin, '#888', 1);

	}

	displayMain();
  // intervalTimer(true);  --> wird nur in "tim.njk" gestartet
});
 
function loginUser() {
	const stateColor = [ '#888', 'yellow', '#6F9'];
	const stateStroke = [1,1,2];
	if (++statusLogin > 2) statusLogin = 0;
	setLucideStroke(buttonLogin, stateColor[statusLogin], stateStroke[statusLogin]);
}


/***
 * Diese Funktion wird vom Button im Footer unten links aufgerufen,
 * um die Sichtbarkeit der Footerzeile umzuschalten.
 */
function footerToggleVisibility() {
  var domX = document.getElementById("layoutCopyright");
  if (domX.style.display === "none") {
    domX.style.display = "block";
  } else {
    domX.style.display = "none";
  }
}
