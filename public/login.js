function login() {
	var provider = new firebase.auth.GoogleAuthProvider();
	firebase.auth().signInWithRedirect(provider);
}

function fire_addUser(uid, name) {
    var database = firebase.database();
    var users_ref = database.ref('users/');
    var new_user = users_ref.child(uid);
    
    new_user.set({
        name: name,
        location: "placeholder",
        parlor: "placeholder",
        uploads: [],
        about: "placeholder"
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
            fire_addUser(uid, name)
        }
        
        window.location.replace("index.html");
        
    });
}

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        name = user.displayName;
        uid = user.uid;
        addIfUserExists(uid, name);
    }
});