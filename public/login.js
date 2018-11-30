let valid_info;

function login() {
    // Get the location
    var user_location = document.getElementById('location_input').value;
    var user_parlor = document.getElementById('parlor_input').value;
    var user_bio = document.getElementById('bio_input').value;
    valid_info = (user_location != "") && (user_parlor != "") && (user_bio != "");
    if (valid_info) {
        sessionStorage.location_input = user_location;
        sessionStorage.parlor_input = user_parlor;
        sessionStorage.bio_input = user_bio;
    }
    
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);
}

function fire_addUser(uid, name) {
    var database = firebase.database();
    var users_ref = database.ref('users/');
    var new_user = users_ref.child(uid);
    
    new_user.set({
        name: name,
        location: sessionStorage.location_input,
        parlor: sessionStorage.parlor_input,
        uploads: [],
        about: sessionStorage.bio_input
    });
    
    return new_user.key
}

function addIfUserExists(uid, name){
    var database = firebase.database();
    var users_ref = database.ref('users/');
    var user_exists;
    users_ref.child(uid).once('value', function(snapshot) {
        if (snapshot.exists()) {
            user_exists = true;
        }
        else {
            user_exists = false;
        }
        
        if (!user_exists) {
            fire_addUser(uid, name);
        }
        
        window.location.replace("index.html");

        /*
        if (!user_exists && valid_info) {
            fire_addUser(uid, name);
            window.location.replace("index.html");
        }
        else if (user_exists){
            window.location.replace("index.html");   
        }
        else if (!valid_info) {
            alert("Please enter info in the boxes below and try again");
            var user = firebase.auth().currentUser;
            user.delete();
            firebase.auth().signOut();
        }
        */
    });
}

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        name = user.displayName;
        uid = user.uid;
        addIfUserExists(uid, name);
    }
});