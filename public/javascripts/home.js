function onButtonClick(button) {
    $button = $(button)[0];
    // remove current selection
    $(".selected").removeClass("selected");
    $section = $("."+button.value + ".waiting");
    $section.addClass("selected");
}
