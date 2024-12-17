// console.log($(".main button").css("display"));  // block

$("#amount_main").text(formatNumber(homeCountry.conversionRate));
for (let i = 0; i < neighbors.length; i++) {

    $("#amount_" + i).text(formatNumber(neighbors[i].conversionRate));
}

let deletedCards = [];

$(".btn-close").on("click", function(event) {
    let index = this.id[this.id.length-1];
    deletedCards.push(index);
    $("#card"+index).css("display", "none");
})

$("[id^='card']").on("click", function(event) {
    if (event.target === this.querySelector("button")) {
        return;
    }
  //  console.log("the form about to be submitted is: " + this.querySelector("form"));
    prepareDeletedCards();
    this.querySelector("form").submit();
        
});

$(".main input").on("input", function(event) {
    if ($(".main select").val() === "amount") {
        this.value = allowOnly("numbers", this.value);
       
        $("#amount_main").text(formatNumber(event.target.value));
    
        const factor = Number(event.target.value) / Number(homeCountry.conversionRate);
        
        for (let i = 0; i < neighbors.length; i++) {
            const newValue = factor * Number(neighbors[i].conversionRate);
            $("#amount_" + i).text(formatNumber(newValue));
        }
    }
    else {
        this.value = allowOnly("words", this.value);


    } 

});

$(".new input").on("input", function (event) {
    this.value = allowOnly("words", this.value);
})

function allowOnly(type, input) {
    if (type==="numbers") {
        return input.replace(/[^0-9.]/g, "");
    }
    else if (type==="words") {
        return input.replace(/[^a-zA-Z ]/g, ""); 
    }
}

// Helper function to format numbers to 2 decimal places
function formatNumber(value) {
    // Convert to a number and fix to 2 decimal places, then remove trailing zeros
    let formattedValue = parseFloat(value).toFixed(2).replace(/\.?0+$/, '');
    
    if (isNaN(formattedValue)) {
        return '0';
    }

    // Split the number into the integer and fractional parts
    let [integerPart, fractionalPart] = formattedValue.split('.');
    
    // Add periods as thousands separators to the integer part
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    
    // Combine the integer part and the fractional part with a comma separator
    return fractionalPart !== undefined ? `${integerPart},${fractionalPart}` : integerPart;
  }
  


$(".btn.plus").on("click", function(event) {
    $(".card.plus").css("display", "none");
    $(".card.new").css("display", "flex");
}) 

$(".main select").on("change", function(event) {
    $(".main input").val("");
    if (event.target.value!=="amount") {
        $(".main button").css("display", "block");
        let what = event.target.value;
        if (event.target.value==="country name") {
            what = "country"
        }
        $(".main input").attr("placeholder", "Enter " + what);

    }
    else {
        $(".main button").css("display", "none");
        $(".main input").attr("placeholder", "Enter amount (" + homeCountry.currencySymbol +")");
    }

   // console.log("Main select changed");
   // console.log("chosen" + event.target.value);
    
   
})

$(".new select").on("change", function(event) {
    $(".new input").val("");
    let what = event.target.value;
    if (event.target.value==="country name") {
        what = "country"
    }
    $(".new input").attr("placeholder", "Enter " + what)
   
   
})
    
$("form").on("submit", function (event) {
   const selected = this.querySelector("select").value;
   if (selected === "amount") {
    event.preventDefault();
    return;
   }
   const textInput = this.querySelector("input[type='text']");
    if (textInput.value.length < 2 || textInput.value.length > 56 ) {
        alert("Enter a proper " + selected + "!");
        event.preventDefault();
        return;
    }
    // at this point the form will be submitted, so preparation needs to be done
    prepareDeletedCards();
    
});


function prepareDeletedCards() {
    $("form input[name='neighbors']").val(JSON.stringify(deletedCards));

}