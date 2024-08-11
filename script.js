//data - from IRC
const brackets = [
  [11000, 0.1],
  [44725, 0.12],
  [95375, 0.22],
  [182100, 0.24],
  [231250, 0.32],
  [578125, 0.35],
  [1000000000, 0.37]
];
//calculated helper column - cumulative tax through the end of the previous bracket
const cumTax = [];
for (let i = 0; i < brackets.length; i++) {
  let A = i > 0 ? brackets[i - 1][0] : 0;
  let B = i > 1 ? brackets[i - 2][0] : 0;
  let C = i > 0 ? brackets[i - 1][1] : 0;
  let D = i > 0 ? cumTax[i - 1] : 0;
  let result = ((A - B) * C) + D;
  cumTax.push(result);
}

//formatting related stuff
function cleanup(stuff){  
  return stuff.value.replace(/[^\d.]/g, ""); // Remove any non-numeric characters except decimal point
}

function currencyFormat(input) {
  let value = cleanup(input)
  if (value !== "") {       
    document.getElementById("button").innerText =
      "Calculate tax liability for " + minFormat(value);
  }
}

function minFormat(val) {
  lu =
     "$" +
      parseFloat(val)
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, "$&,");    
  return lu
}

//lookup up the Taxable Income input amount in the brackets
function lookupValue(lookup) {
  for (let i = 0; i < brackets.length; i++) {
    if (brackets[i][0] >= lookup) {
      let prevMaxTI = i > 0 ? brackets[i - 1][0] : 0;
      let currRate = brackets[i][1];
      let currCumTax = cumTax[i];
      return [prevMaxTI, currRate, currCumTax];
    }
  }
  // If the lookup value is greater than all values in brackets, return the last row's values
  let lastIndex = brackets.length - 1;
  return [brackets[lastIndex][0], brackets[lastIndex][1], cumTax[lastIndex]];
}

//actual tax calculation
function calculateTax() {  
  let 
  TI = parseFloat(cleanup(document.getElementById("income"))),
  [prevMaxTI, currRate, currCumTax] = lookupValue(TI),
  tax = ((TI - prevMaxTI) * currRate) + currCumTax;
  document.getElementById("result").innerText = "Tax Liability: " + minFormat(tax);

}