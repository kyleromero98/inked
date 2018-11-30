var user_logged = false

var database = firebase.database();

var maxcount = 1;

$(document).ready(function() {
  setUserLogged();

  var maxcountRef = firebase.database().ref('imgs/max_count');
  maxcountRef.once('value').then(function(snapshot) {
    if (snapshot.exists()) {
      maxcount = snapshot.val().max_count;

      var imgcount = 0;
  for(var i = maxcount-1; i >= 0 && imgcount < 13; i--){
    var databaseRef = firebase.database().ref('imgs/'+i);
    databaseRef.once('value').then(function(snapshot) {
      if (snapshot.exists()) {
        var url = snapshot.val().url;
        var caption = snapshot.val().caption;
        var image1 = '<img src=' + url +' style="width:100%" onclick="onClick(this)" alt="'+caption+'">';
        var imgnum = 'image' + imgcount;
        document.getElementById(imgnum).innerHTML = image1;
        imgcount++;
      }
    });
  }
    }
  });
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