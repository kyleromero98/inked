var user_logged = false

var database = firebase.database();
var searchVal;
var imgIDs = [];

$(document).ready( function() {
    setUserLogged();
    setTopBarLinks();
    
	searchVal = localStorage.searchVal;
	
	var databaseSearch = database.ref("tags/" + searchVal);
	databaseSearch.once('value').then(function(snapshot) {
		if (snapshot.exists()) {
			imgIDs = snapshot.val().current_tag_image_list;
			var imgcount = 0;
			for (var i = 0; i < imgIDs.length && imgcount < 13; i++) {
				var imgRef = database.ref("imgs/" + imgIDs[i]);
				imgRef.once('value').then(function(snapshot) {
					var url = snapshot.val().url;
					var caption = snapshot.val().caption;
					var image1 = '<img src=' + url +' style="width:100%" onclick="onClick(this)" alt="'+caption+'">';
					var imgnum = 'image' + imgcount;
					document.getElementById(imgnum).innerHTML = image1;
					imgcount++;
				});
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
