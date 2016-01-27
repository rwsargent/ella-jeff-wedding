var tabLoad = function (event) {
    event.preventDefault();
    var id = $(this).attr('id');
    if(id == 'rsvp') {
	$.ajax({
            url: "/tab/" + id
	}).success(function (data) {
            $('#main-content').html(data);
//	    dynamicMaterializeBindings();
	});
    }
};

$(document).ready(function () {
//    $("li.tab").click(tabLoad);
    RSVPBindings();
});

var dynamicMaterializeBindings = function() {
    $('.collapsible').collapsible({
	accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });
}

var RSVPBindings = function() {
    $('input.regrets').change(function() {
	var choice = this.id;
	$.ajax( {
	    url : "/rsvp/" + choice
	}).success(function(data){
	   $('#rsvp-anchor').html(data);
	});
    });
}

var guestInputChangeHandler = function(input) {
    var inputList = document.getElementById('input-list');
    if(!input.value) {
	if(inputList.childNodes.length !== 1) {
	    input.remove();
	    inputList.childNodes[inputList.childNodes.length-1].focus();
	}
    }
    if(input.hasAttribute('spawned')) {
	return;
    }
    //mark this input as already spawning one.
    input.setAttribute('spawned', '');
    var newInputElement = document.createElement('input');
    newInputElement.className = 'coming-name';
    newInputElement.type = 'text';
    newInputElement.setAttribute('oninput', 'guestInputChangeHandler(this);');
    newInputElement.setAttribute('placeholder', 'First Last');
    inputList.appendChild(newInputElement);
}

var rsvpClick = function(button) {
    var reqObjec = {
	names : getVaulesFromDynamicInputs()
    };
    var title = document.getElementById('title-input'),
        artist = document.getElementById('artist-input');
    if(!checkValid(title) | !checkValid(artist)) { // check valid as the side effect of marking as invalid
	return;
    }

    if(!reqObjec.names.length) {
	// maybe mark something invalid
	return;
    }
    rsvpPost('/rsvp', reqObjec);
}

var checkValid = function(input) {
    if(!input.value) {
	input.classList.add('invalid');
	return false;
    }
    return true;
}

var regretClick = function() {
    var req = {};
    req.message = document.getElementById('regret-message').value;
    req.names = getVaulesFromDynamicInputs();
    if(!req.names.length) {
	return;
    }
    rsvpPost('/regrets', req);
};

var getVaulesFromDynamicInputs = function(inputListId) {
    var inputs = []
    var inputList = document.getElementById('input-list');
    for(var inputIdx = 0; inputIdx < inputList.childNodes.length; inputIdx++) {
	var input = inputList.childNodes[inputIdx];
	if(input.value) {
	    inputs.push(input.value);
	}
    }
    return inputs;
};

var rsvpPost = function(url, request) {
    $.post(url, request, function(data) {
	$('#rsvp-tab').html(data);	
    });
}
