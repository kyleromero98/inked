
var database = firebase.database();

var user_name = "";
var user_email = "";
var user_id = "";
var user_uploads = [];

$(document).ready(function() {
    get_user_info();
});

function get_user_info() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            user_name = user.displayName;
            user_email = user.email;
            user_id = user.uid;
            providerUser = firebase.auth().currentUser;
            providerUser.providerData.forEach(function (profile) {
                if (profile) {
                    console.log(profile.photoURL);
                    $("#profile_pic").attr("src", profile.photoURL);
                } else {
                    $("#profile_pic").attr("src", "imgs/artist.jpeg");
                }
            });
            loadUserInfo();
        }
        database.ref('users/' + user_id + '/uploads').limitToLast(6).once('value').then(function(snapshot) {
            if (snapshot.exists()) {
                snapshot.forEach( function(childSnapshot) {
                    user_uploads.push(childSnapshot.val());
                });
                var position = 0;
                for(let i = user_uploads.length - 1;  i >= 0 ; i--) {
                    database.ref('imgs/' + user_uploads[i]).once('value').then(function(snapshot) {
                        if (snapshot.exists()) {
                            var url = snapshot.val().url;
                            var caption = snapshot.val().caption;
                            var tempimage = '<img src=' + url +' style="width:100%" onclick="onClick(this)" alt="'+ caption +'" >';
                            var imgnum = 'image2' + position;
                            position++;
                            document.getElementById(imgnum).innerHTML = tempimage; //todo
                        }
                    });
                }
            }
        });   
    }); 
}

function appendTextNode(parent, text) {
    var text_node = document.createTextNode(text);
    parent.appendChild(text_node);
}

function loadUserInfo() {
    document.getElementById("user_name").innerHTML = user_name;
    var users_ref = database.ref("users/" + user_id);
    
    // Get the user info
    users_ref.once('value', function(snapshot) {
        user_info = snapshot.val();
        appendTextNode(document.getElementById("user_location"), user_info["location"]);
        appendTextNode(document.getElementById("user_parlor"), user_info["parlor"]);
        appendTextNode(document.getElementById("user_about"), user_info["about"]);
    });
}



