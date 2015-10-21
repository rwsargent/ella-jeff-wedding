$(document).ready(function() {
    $('#password-form').ajaxForm({
	url : '/login',
	dataType : 'json',
	success : function() {
	    alert("you're in!");
	}
    });
});
