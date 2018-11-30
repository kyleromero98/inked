function login() {
	var provider = new firebase.auth.GoogleAuthProvider();
	firebase.auth().signInWithRedirect(provider);

	firebase.auth().getRedirectResult().then(function(result) {
		if (result.credential) {
		  // This gives you a Google Access Token. You can use it to access the Google API.
		  var token = result.credential.accessToken;
		}
		// The signed-in user info.
		var user = result.user;
	}).catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		// The email of the user's account used.
		var email = error.email;
		// The firebase.auth.AuthCredential type that was used.
		var credential = error.credential;
		// ...
	});
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

function checkIfUserExists(uid){
    var database = firebase.database();
    var users_ref = database.ref('users/');
    
    users_ref.child(uid).once('value', function(snapshot) {
        if (snapshot.exists()) {
            return true;
        }
        else {
            return false;
        }
    });
}

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        if (user != null) {
            name = user.displayName;
            email = user.email;
            uid = user.uid;
            
            if (!checkIfUserExists(uid)) {
                fire_addUser(uid, name);
            }
        }
    } else {
        alert("login state changed: user is logged in");
    }
});