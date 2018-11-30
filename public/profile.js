var user_name = "";
var user_email = "";
var user_id = "";
var autocomplete_terms = [];

var user_pics = [];

$(document).ready(function() {
	get_autocomplete_terms();
    get_user_info();

     var uploadsRef = firebase.database().ref('users/'+user_id+'/uploads');
     uploadsRef.once('value').then(function(snapshot) {
    if (snapshot.exists()) {
        user_pics = snapshot.val().uploads;
        for(var i = 0; i < user_pics.length(); i++) {
            var imgRef = firebase.database().ref('imgs/' + user_pics[i]);  //hmm is this the value
            imgRef.once('value').then(function(snapshot) {
                if (snapshot.exists()) {
                    var url = snapshot.val().url;
                    var caption = snapshot.val().caption;
                    var tempimage = '<img src=' + url +' style="width:100%" onclick="onClick(this)" alt="'+caption+'" >';
                    var imgnum = 'image' + i;
                    document.getElementById(imgnum).innerHTML = tempimage; //todo
                }
            });
        }
    }
    //else "You have no imaged to display. Upload an image to get started."
  });
});

function get_user_info() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            user_name = user.displayName;
            user_email = user.email;
            user_id = user.uid;
            loadUserInfo();
        }
    }); 
}

function appendTextNode(parent, text) {
    var text_node = document.createTextNode(text);
    parent.appendChild(text_node);
}

function loadUserInfo() {
    document.getElementById("user_name").innerHTML = user_name;
    
    var database = firebase.database();
    var users_ref = database.ref("users/" + user_id);
    
    // Get the user info
    users_ref.once('value', function(snapshot) {
        user_info = snapshot.val();
        appendTextNode(document.getElementById("user_location"), user_info["location"]);
        appendTextNode(document.getElementById("user_parlor"), user_info["parlor"]);
        appendTextNode(document.getElementById("user_about"), user_info["about"]);
    });
}

function get_autocomplete_terms() {
	var database = firebase.database();
	var auto_terms = database.ref("autocomplete_terms/autocomplete_terms/");
	auto_terms.once('value').then(function(snapshot) {
		snapshot.forEach( function(childSnapshot) {
			autocomplete_terms.push(childSnapshot.val());
		});
	});
	
	$("#search_bar").autocomplete({
		minLength:2,
		source:autocomplete_terms,
	});
}

