$( function() {
    $("#interest_form").find("#interest_input").autocomplete({
      source: "adinterest",
      minLength: 3
    });
} );
