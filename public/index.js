var user_logged = false

$(document).ready(function() {
    setUserLogged();
    setTopBarLinks();
});

function setTopBarLinks() {
    setUserButtonHref();
    if (user_logged) {
        makeSignOutVisible();
    }
}

function makeSignOutVisible() {
    document.getElementById("sign_out_span").style.display = "inline-block";
}

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
        makeSignOutVisible();
        setUserButtonHref();
    }
    else {
        user_logged = false;
    }
    });
}

function signOut() {
    firebase.auth().signOut().then(function() {
        window.location.replace("index.html");
    });
}