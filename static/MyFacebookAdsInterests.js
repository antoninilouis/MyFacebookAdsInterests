$( function() {
    $("input[id|='interest-input']").autocomplete({
      source: "adinterest",
      minLength: 3
    });
} );
