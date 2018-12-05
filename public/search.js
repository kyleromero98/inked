var user_logged = false

var database = firebase.database();
var searchVal;
var imgs = [];

$(document).ready( function() {
    setUserLogged();
    setTopBarLinks();
    
	searchVal = localStorage.searchVal;
	
	database.ref("imgs").orderByChild("tag").startAt(searchVal).endAt(searchVal + "\uf8ff").limitToLast(12).once('value').then(function(snapshot) {
		if (snapshot.exists()) {
      		snapshot.forEach(function(childSnapshot) {
        		imgs.push(childSnapshot.val());
      		});
			var imgcount = 11;
			for (var i = 0; i < imgs.length; i++) {
				var url = imgs[i].url;
				var caption = imgs[i].caption;
				var image1 = '<img src=' + url +' style="width:100%" onclick="onClick(this)" alt="'+caption+'">';
				var imgnum = 'image' + imgcount;
				document.getElementById(imgnum).innerHTML = image1;
				imgcount--;
			}
		} else {
			alert("No tattoos with this tag ):");
			window.location.replace("index.html");
		}
    });	
});

function setTopBarLinks() {
    setUserButtonHref();
    if (user_logged) {
        makeSignOutVisible();
    }
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
  		} else {
            user_logged = false;
  		}
	});
}


function makeSignOutVisible() {
    document.getElementById("sign_out_span").style.display = "inline-block";
}

function signOut() {
    firebase.auth().signOut().then(function() {
        window.location.replace("index.html");
    });
}