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
    $("#amount_main").text(formatNumber(event.target.value));
    
    const factor = Number(event.target.value) / Number(homeCountry.conversionRate);
    
    for (let i = 0; i < neighbors.length; i++) {
        const newValue = factor * Number(neighbors[i].conversionRate);
        $("#amount_" + i).text(formatNumber(newValue));
    }
});

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
    
$("form").on("submit", prepareDeletedCards);

function prepareDeletedCards() {
 //   console.log("deleted cards about to be sent are: " + deletedCards)
    $("form input[name='neighbors']").val(JSON.stringify(deletedCards));
}