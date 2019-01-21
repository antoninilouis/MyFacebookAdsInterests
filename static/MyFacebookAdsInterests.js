$( function() {
    $("#interest_form").children().autocomplete({
      source: "adinterest",
      minLength: 3
    });
} );
