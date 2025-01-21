/***
 *	utility.js - Javascript Helpers
 * 
 *	Copyright 2024 Michael Stumpp (michael@stumpp.name)
 *
 * 07.01.2024 completly new - bundling JS
 */


/**
 * 	Diese Funktion setzt Farbe und Breite eines Lucide Icons, wenn man das 'parent' Element übergibt.
 *	Das sollte auch mit jedem anderen SVG Childnode funktionieren.
 *
 **/
	
function setLucideStroke (parentElement, strokeColor = '#FFF', strokeWidth = 2) {
	if (! parentElement) return;
	const svgList = parentElement.getElementsByTagName("svg");
	for (let i = 0; i < svgList.length; i++) {
		svgList[i].getAttributeNode("stroke").value = strokeColor;
		svgList[i].getAttributeNode("stroke-width").value = strokeWidth;
	}
}
	

/**	********************************************************************
 *	-hwn- Funktionen für die GUI
 **	********************************************************************
 *
 *	displayMain		Anzeigen | Verbergen der <main> Sektionen 
 *	openModal		Modal-Fenster anzeigen
 *	closeModal		Modal-Fenster schließen
 */


function displayMain(state=true) {
	const nodes = document.getElementsByTagName('main');
	for (let i = 0; i < nodes.length; i++) {
		nodes[i].style.display = (state) ? "block" : "none";
	}
}

function openModal(modalName) {
	document.getElementById(modalName).style.display='block';
}

function closeModal(modalName) {
	document.getElementById(modalName).style.display='none';
}

/** sendMail
 *
 *	origin: https://stackoverflow.com/questions/51805395/navigator-clipboard-is-undefined
 *
 */

function sendMail(receiver, subject, body, closewindow=false) {
	const link = 'mailto:' + receiver
			   + '?subject=' + encodeURIComponent(subject)
			   + '&body=' + encodeURIComponent(body.replace('&', '&amp;'));
	const win = window.open(link);
	if (closewindow) win.close();
}

/** copyToClipboard
 *
 *	origin: https://stackoverflow.com/questions/51805395/navigator-clipboard-is-undefined
 *
 */

async function copyToClipboard(textToCopy) {
    // Navigator clipboard api needs a secure context (https)
    if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
    } else {
        // Use the 'out of viewport hidden text area' trick
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;

        // Move textarea out of the viewport so it's not visible
        textArea.style.position = "absolute";
        textArea.style.left = "-999999px";

        document.body.prepend(textArea);
        textArea.select();

        try {
            document.execCommand('copy');
        } catch (error) {
            console.error(error);
        } finally {
            textArea.remove();
        }
	}
}


