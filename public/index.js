var user_logged = false

var mapping = ["one", "two", "three", "four"];
var current_page = 0;

var maxcount = 1;

$(document).ready(function() {
  setUserLogged();
  setTopBarLinks();

  firebase.database().ref('imgs/max_count').once('value').then(function(snapshot) {
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

function one() {
  $('#' + mapping[current_page]).removeClass("w3-black");
  $('#' + mapping[current_page]).addClass("w3-hover-black");
  current_page = 0;
  $('#' + mapping[current_page]).removeClass("w3-hover-black");
  $('#' + mapping[current_page]).addClass("w3-black");
  reload();
}

function two() {
  $('#' + mapping[current_page]).removeClass("w3-black");
  $('#' + mapping[current_page]).addClass("w3-hover-black");
  current_page = 1;
  $('#' + mapping[current_page]).removeClass("w3-hover-black");
  $('#' + mapping[current_page]).addClass("w3-black");
  reload();
}

function three() {
  $('#' + mapping[current_page]).removeClass("w3-black");
  $('#' + mapping[current_page]).addClass("w3-hover-black");
  current_page = 2;
  $('#' + mapping[current_page]).removeClass("w3-hover-black");
  $('#' + mapping[current_page]).addClass("w3-black");
  reload();
}

function four() {
  $('#' + mapping[current_page]).removeClass("w3-black");
  $('#' + mapping[current_page]).addClass("w3-hover-black");
  current_page = 3;
  $('#' + mapping[current_page]).removeClass("w3-hover-black");
  $('#' + mapping[current_page]).addClass("w3-black");
  reload();
}

function reload () {
  firebase.database().ref('imgs/max_count').once('value').then(function(snapshot) {
    if (snapshot.exists()) {
      maxcount = snapshot.val().max_count;

      var imgcount = 0;
      for(var i = maxcount-(1 + current_page * 12); i >= 0 && imgcount < 13; i--){
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
}

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

