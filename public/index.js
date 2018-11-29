var user_logged = false

$(document).ready(function() {
    setUserLogged();
});

function setUserButtonHref() {
	if (user_logged) {
    	document.getElementById("profile_button").href="profile.html";
	}
	else {
   		document.getElementById("profile_button").href="login.html";
	}
}

function setUserLogged() {
	firebase.auth().onAuthStateChanged(function(user) {
  		if (user) {
  			user_logged = true;
  		} else {
    		user_logged = false;
  		}
	});
}