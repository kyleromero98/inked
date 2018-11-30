var autocomplete_terms = [];

$(document).ready( function() {
	get_autocomplete_terms();
});


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

function redir() {
	localStorage.searchVal = document.getElementById("search_bar").value;
	window.location.replace("search.html");
}