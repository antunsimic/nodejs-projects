// console.log($(".main button").css("display"));  // block
let mainSelect = $(".main select")
let newSelect = $(".new select")
let mainInput = $(".main input[type='text']")
let newInput = $(".new input[type='text']")

function checkValidity(input, selected) {
    if (input.value.length < 2 || input.value.length > 56 ) {
        input.setCustomValidity("Enter a proper " + selected + "!");
    }
    else {
        input.setCustomValidity("");
    }
}


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
    prepareDeletedCards();
    const form = this.querySelector("form");
    form.submit();
        
});

mainInput.on("input", function(event) {
    
    if (mainSelect.val() === "amount") {
        this.value = allowOnly("numbers", this.value);
       
        $("#amount_main").text(formatNumber(event.target.value));
    
        const factor = Number(event.target.value) / Number(homeCountry.conversionRate);
        
        for (let i = 0; i < neighbors.length; i++) {
            const newValue = factor * Number(neighbors[i].conversionRate);
            $("#amount_" + i).text(formatNumber(newValue));
        }
    }
    else {
        checkValidity(this, mainSelect.val())
        this.value = allowOnly("words", this.value);


    } 

});

newInput.on("input", function (event) {
    checkValidity(this, newSelect.val())
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

mainSelect.on("change", function(event) {
    mainInput.val("");
    
    if (event.target.value!=="amount") {
        checkValidity(mainInput[0], event.target.value)
        $(".main button").css("display", "block");
        let what = event.target.value;
        if (event.target.value==="country name") {
            what = "country"
        }
        mainInput.attr("placeholder", "Enter " + what);

    }
    else {
        $(".main button").css("display", "none");
        mainInput.attr("placeholder", "Enter amount (" + homeCountry.currencySymbol +")");
    }

   
    
   
})

newSelect.on("change", function(event) {
    newInput.val("");
    let what = event.target.value;
    checkValidity(newInput[0], what)
    if (event.target.value==="country name") {
        what = "country"
    }
    newInput.attr("placeholder", "Enter " + what)
   
   
})
    
$("form").on("submit", function (event) {
    event.preventDefault();
    const selected = this.querySelector("select").value;
   if (selected === "amount") {
    return;
   }
   const textInput = this.querySelector("input[type='text']");
    checkValidity(textInput, selected)
    
    if (textInput.reportValidity()) {
        prepareDeletedCards();
        this.submit()
    }
    


});


function prepareDeletedCards() {

    $("form input[name='deletedNeighbors']").val(JSON.stringify(deletedCards));


}