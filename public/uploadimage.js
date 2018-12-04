// Javascript file for the upload images dialog

var current_count = 0;

var current_tag_image_list = [];
var autocomplete_terms = [];
var uploads = [];

var user_id = "";

$( document ).ready(function() {

  setUserLogged();
  setTopBarLinks();

  firebase.database().ref('imgs/max_count').once('value').then(function(snapshot) {
    if (snapshot.exists()) {
      current_count = snapshot.val().max_count;
    }
  });

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      user_id = user.uid;
    
      // Get the user info
      firebase.database().ref("users/" + user_id).once('value', function(snapshot) {
        user_info = snapshot.val();
        $("#location").val(user_info["location"]);
        $("#parlor").val(user_info["parlor"]);
        $("#artist").val(user_info["name"]);
      });
    }
  });
  // downloading autocomplete data
  firebase.database().ref('autocomplete_terms').once('value').then(function(snapshot) {
    if (snapshot.exists()) {
      autocomplete_terms = snapshot.val().autocomplete_terms;
    } else {
      autocomplete_terms = [];
    }
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
      firebase.database().ref('imgs/max_count').once('value').then(function(snapshot) {
        if (snapshot.exists()) {
          current_count = snapshot.val().max_count;
        }
      });
      writeImageData(current_count, document.getElementById('title').value, document.getElementById('caption').value, document.getElementById('location').value, document.getElementById('parlor').value, document.getElementById('artist').value, document.getElementById('tag').value, downloadURL);
      // head back to profile
    });
  });

});

function writeImageData(img_id, title, caption, location, parlor, artist, tag, url) {
  firebase.database().ref('imgs/' + img_id).set({
    id:img_id,
    title: title,
    caption: caption,
    location: location,
    parlor: parlor,
    artist: artist,
    tag: tag,
    url: url
  });

  // uploading for getting images of the user
  firebase.database().ref('users/' + user_id + '/uploads').once('value').then(function(snapshot) {
    if (snapshot.exists()) {
      uploads = snapshot.val().uploads;
      uploads.push(current_count);
      firebase.database().ref('users/' + user_id + '/uploads').set({uploads});
    } else {
      uploads = [];
      uploads.push(current_count);
      firebase.database().ref('users/' + user_id + '/uploads').set({uploads});
    }
  });

  // uploading for searchability of images by tags
  firebase.database().ref('tags/' + tag).once('value').then(function(snapshot) {
    if (snapshot.exists()) {
      current_tag_image_list = snapshot.val().current_tag_image_list;
      current_tag_image_list.push(current_count);
      firebase.database().ref('tags/' + tag).set({current_tag_image_list});
    } else {
      current_tag_image_list = [];
      current_tag_image_list.push(current_count);
      firebase.database().ref('tags/' + tag).set({current_tag_image_list});
    }
  });

  // uploading autocomplete data
  autocomplete_terms.push(tag);
  firebase.database().ref('autocomplete_terms').set({autocomplete_terms});

  current_count += 1;
    firebase.database().ref('imgs/max_count').set({
      max_count: current_count
    });
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