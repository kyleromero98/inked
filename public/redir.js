
var database = firebase.database();

var autocomplete_terms = [];
var unique = [];

$(document).ready( function() {
	get_autocomplete_terms();
});


function get_autocomplete_terms() {
	var auto_terms = database.ref("autocomplete_terms");
	auto_terms.once('value').then(function(snapshot) {
		snapshot.forEach( function(childSnapshot) {
			autocomplete_terms.push(childSnapshot.val());
		});
		unique = Array.from(new Set(autocomplete_terms));
		$("#search_bar").autocomplete({
			minLength:2,
			source:unique,
			select: function (event, ui) {
				$( "#search_bar" ).val(ui.item.label);
        		$( "#search_button" ).click();
        		return false;
    		},
    		focus: function( event, ui ) {
        		$( "#search_bar" ).val(ui.item.label);
        		return false;
    		}
		});
	});
	
}

function redir() {
	localStorage.searchVal = document.getElementById("search_bar").value;
	window.location.replace("search.html");
}