console.log('compiled js!');

var tabLoad = function(event) {
    event.preventDefault();
    var id = $(this).attr('id');
    $.ajax({
	    url : "/tab/" + id
    }).success(function(data) {
	    $('#main-content').html(data);
    });
    
}

$(document).ready(function() {
    $("li.tab").click(tabLoad);
});
// bind click event on li

// send id --> /tab/:id

// response #main-content
