// Javascript file for the upload images dialog

var firebaseRef = firebase.database();
var user_logged = false;

var autocomplete_terms = [];
var unique = [];

var user_id = "";

$(document).ready(function() {

  setUserLogged();
  setTopBarLinks();

  // populates fields with known data
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      user_id = user.uid;

      // Query the user info from the database
      firebaseRef.ref("users/" + user_id).once('value', function(snapshot) {
        user_info = snapshot.val();
        $("#location").val(user_info["location"]);
        $("#parlor").val(user_info["parlor"]);
        $("#artist").val(user_info["name"]);
      });
    } else {
      alert("Error: No user was found. Please create an account.");
    }
  });

  // Downloading autocomplete data for tag field
  firebaseRef.ref('autocomplete_terms').once('value').then(function(snapshot) {
    if (snapshot.exists()) {
      snapshot.forEach( function(childSnapshot) {
        autocomplete_terms.push(childSnapshot.val());
      });

      // Assign autocomplete array
      unique = Array.from(new Set(autocomplete_terms));
      $("#tag").autocomplete({
        minLength:2,
        source:unique,
        select: function (event, ui) {
          $( "#tag" ).val(ui.item.label);
            return false;
        },
        focus: function( event, ui ) {
          $( "#tag" ).val(ui.item.label);
          return false;
        }
      });
    } else {
      autocomplete_terms = [];
    }
  });
  $( "#title" ).focus();
});

$( "#upload_image" ).click(function () {
  var storageRef = firebase.storage().ref();
  var file = document.getElementById('file_to_upload').files[0];

  var metadata = {
    contentType: 'image/jpeg'
  };

  var uploadTask = storageRef.child('images/' + file.name).put(file, metadata);

  uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
  function(snapshot) {
    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case firebase.storage.TaskState.PAUSED:
        console.log('Upload is paused');
        break;
      case firebase.storage.TaskState.RUNNING:
        console.log('Upload is running');
        break;
    }
  }, function(error) {

  switch (error.code) {
    case 'storage/unauthorized':
      // User doesn't have permission to access the object
      break;
    case 'storage/canceled':
      // User canceled the upload
      break;
    case 'storage/unknown':
      // Unknown error occurred, inspect error.serverResponse
      break;
  }
  }, function() {
    uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
      console.log('File available at', downloadURL);
      writeImageData($("#title").val(), $("#caption").val(), $("#location").val(), $("#parlor").val(), $("#artist").val(), $("#tag").val(), downloadURL);
    });
  });

});

function writeImageData(title, caption, location, parlor, artist, tag, url) {
  var newUploadRef = firebaseRef.ref('imgs').push();

  // upload information for new image
  newUploadRef.set({
    title: title,
    caption: caption,
    location: location,
    parlor: parlor,
    artist: artist,
    tag: tag,
    url: url
  });

  // uploading of new uploads list for user
  firebaseRef.ref('users/' + user_id + '/uploads').push().set(newUploadRef.key);

  // uploading autocomplete data
  firebaseRef.ref('autocomplete_terms').push().set(tag);

  // return to the profile page
  window.location.href = "profile.html";
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