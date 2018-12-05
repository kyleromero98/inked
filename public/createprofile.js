// Javascript file for creating a profile

var database = firebase.database();

var user_id = "";
var user_name = "";
var user_logged = false;

$(document).ready(function() {
    $( "#location" ).focus();
});

function writeProfileData() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            user_id = user.uid;
            user_name = user.displayName;
        
            var updatedProfileData = {
                about: $("#about").val(),
                parlor: $("#parlor").val(),
                location: $("#location").val(),
                name: user_name
            };
            // Get the user info
            database.ref('users/' + user_id).update(updatedProfileData);
            window.location.replace("index.html");
        }
    });
}