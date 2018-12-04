// Javascript file for the edit profile dialog

var database = firebase.database();

var user_id = "";
var user_name = "";
var user_logged = false;

$(document).ready(function() {
  setUserLogged();
  setTopBarLinks();
  get_user_info();
});


function writeProfileData() {
  var updatedProfileData = {
    about: $("#about").val(),
    parlor: $("#parlor").val(),
    location: $("#location").val(),
    name: user_name
  }; 
  database.ref('users/' + user_id).update(updatedProfileData);
  window.location.href = "profile.html";
}

function get_user_info() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      user_id = user.uid;
      user_name = user.displayName;

      // Get the user info
      database.ref("users/" + user_id).once('value', function(snapshot) {
        user_info = snapshot.val();
        $("#location").val(user_info["location"]);
        $("#parlor").val(user_info["parlor"]);
        $("#about").val(user_info["about"]);
      });
    }
  }); 
}

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