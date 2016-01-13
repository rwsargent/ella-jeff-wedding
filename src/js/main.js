console.log('compiled js!');

var loadPage = function(event) {
    event.preventDefault();
    var id = $(this).attr('id');
    $.ajax({
	url : "/tab/" + id
    }).success(function(data) {
	$('#main-content').html(data);
    });
    
}

$(document).ready(function() {
    $("li.button-bar-item").click(loadPage);
});
// bind click event on li

// send id --> /tab/:id

// response #main-content
