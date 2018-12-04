// Javascript file for the edit profile dialog

var user_id = "";

var uploads = [];

$(document).ready(function() {
  alert("hello")
  setUserLogged();
  setTopBarLinks();

  get_user_info();
  // add stuff here to auto populate with recommended values
});


function writeProfileData() {
  alert("hi")
  firebase.database().ref('users/' + user_id).once('value').then(function(snapshot) {
    if (snapshot.exists()) {
      alert("hi");
      uploads = snapshot.val();
      firebase.database().ref('users/' + user_id + '/uploads').set({uploads});
    }
    document.write("hi");
    firebase.database().ref('users/' + user_id).set({
      about: document.getElementById('about').value,
      parlor: document.getElementById('parlor').value,
      location: document.getElementById('location').value,
      uploads:uploads
    });
    document.write("hi");
    window.location.href = "profile.html";
  });
}

function get_user_info() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      user_id = user.uid;
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
            alert("hello again")
            makeSignOutVisible();
            setUserButtonHref();
      } else {
            user_logged = false;
      }
  });
}

function makeSignOutVisible() {
    alert("hello again")
    document.getElementById("sign_out_span").style.display = "inline-block";
}

function signOut() {
    firebase.auth().signOut().then(function() {
        window.location.replace("index.html");
    });
}