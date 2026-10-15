// Helper function to find Greatest Common Divisor
function getGCD(a, b) {
  return b ? getGCD(b, a % b) : a;
}

function convertToFraction(decimal) {
  if (Number.isInteger(decimal)) return decimal.toString();

  // 1. Separate whole number and decimal parts
  const wholeNumber = Math.floor(decimal)
  const decimalPart = (decimal - wholeNumber).toFixed(10) // Avoid floating point precision issues

  // 2. Count decimal places to determine the denominator base
  const fractionLength = decimalPart.toString().split('.')[1].replace(/0+$/, '').length;
  const denominator = Math.pow(10, fractionLength);
  const numerator = Math.round(decimalPart * denominator);

  // 3. Reduce the fraction using GCD
  const gcd = getGCD(numerator, denominator);
  const reducedNumerator = numerator / gcd;
  const reducedDenominator = denominator / gcd;

  // 4. Format output (handles simple fractions or mixed fractions)
  if (wholeNumber > 0) {
    return `${wholeNumber} ${reducedNumerator}/${reducedDenominator}`
  }
  return `${reducedNumerator}/${reducedDenominator}`;
}

const addIngBtn = document.querySelector("#add-row-btn");
const ingInput = document.querySelector(".ingredient-inputs");
const ingRow = document.querySelector("#ing-1");

// Duplicate ingredients row on button click
let i = 3;
addIngBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (++i > 8) return;

  // Clone the first row of input
  const clone = ingRow.cloneNode(true);

  // Remove 'ing-1' from classes & add current clone number to row class
  clone.id = "ing-" + i;

  // Change the number text by setting the fieldset's textContent
  clone.children[0].value = "";
  clone.children[2].value = "";

  // Set the name and id of inputs and select
  clone.children[0].name = "qty-" + i;
  clone.children[1].name = "meas-" + i;
  clone.children[2].name = "ing-name-" + i;

  clone.children[0].id = "qty-" + i;
  clone.children[1].id = "meas-" + i;
  clone.children[2].id = "ing-name-" + i;

  // Add the new fieldset to the container
  ingInput.appendChild(clone);
});

const submitBtn = document.querySelector("#submit-form");

// Calculate scaled recipe by portions on button click
submitBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const recipeName = document.querySelector("#recipe-name").value;
  const ogPortion = document.querySelector("#og-portion").value;
  const scaledPortion = document.querySelector("#scaled-portion").value;

  // Get all filled out ingredients
  const quantity = [...document.querySelectorAll(".quantity")];
  const filteredQuantity = quantity
    .filter(q => q.value.trim() !== "")
    .map(q => q.value);

  const measure = [...document.querySelectorAll(".measure")];
  const filteredMeasure = measure
    .filter(m => m.value.trim() !== "pick-type")
    .map(m => m.value);

  const ingName = [...document.querySelectorAll(".ing-name")];
  const filteredIngName = ingName
    .filter(i => i.value.trim() !== "")
    .map(i => i.value);
  const sanitizeInput = filteredIngName.map(input => input.replace(/[^a-zA-Z0-9 -]/g, ""));

  const formData = [recipeName, ogPortion, scaledPortion];

  const ingForm = filteredQuantity.map((qty, index) => {
    return [ qty, filteredMeasure[index], sanitizeInput[index] ];
  });

  function formValidation(formData) {
    const recipeNameError = document.querySelector("#recipe-name-error");
    const ogPortionError = document.querySelector("#original-portion-error");
    const scaledPortionError = document.querySelector("#scaled-portion-error");
    const ingredientsError = document.querySelector("#ingredients-error");

    const errorSpan = [recipeNameError, ogPortionError, scaledPortionError, ingredientsError];

    for (const spn of errorSpan) {
      spn.textContent = "";
    }

    for (const data of formData) {
      if (data === '' || data === null || data <= 0) {
        // Check if recipe name is empty
        if (recipeName === '') {
          recipeNameError.textContent = "Fill out recipe name!";
        }
        // Check if orignal portion is a positive integer greater than 0
        if (ogPortion === '' || ogPortion <= 0 || ogPortion == null) {
          ogPortionError.textContent = "Original Portion needs to be a number greater than 0; please do not enter fractions!";
        }
        // Check if scaled portion is a positive integer greater than 0
        if (scaledPortion === '' || scaledPortion <= 0 || scaledPortion == null) {
          scaledPortionError.textContent = "Scaled Portion needs to be a number greater than 0; please do not enter fractions!";
        }
        return false;
      }
    }

    // Checks if at least 1 input is filled in the ingredients field
    if (ingForm.length == 0) {
      ingredientsError.textContent = "Fill in the ingredients form!";
      return false;
    };

    for (const value of ingForm) {
      let [qty, meas, name] = value;

      if (qty === "" || qty <= 0 || qty == null || meas == undefined || name == undefined) {
        ingredientsError.textContent = "Fill out all fields; please do not enter fractions!";
        return false;
      };
    }
    return true;
  }

  const isValid = formValidation(formData);
  const scaledContainer = document.querySelector(".scale-field");

  if (isValid) {
    const conversionFactor = () => {
      const cf = scaledPortion / ogPortion;
      const displayCF = Number(cf.toFixed(2));
      return displayCF;
    };
    console.log(`The Conversion Factor is ${conversionFactor()}.`);

    // Multiply each quantity by conversionFactor
    const solveCF = filteredQuantity.map(f => f * conversionFactor());

    const result = solveCF.map((cf, index) => {
      return {
        qty: cf,
        meas: filteredMeasure[index],
        name: sanitizeInput[index]
      };
    });
    console.log(result);

    if (scaledContainer.firstChild) {
      scaledContainer.removeChild(scaledContainer.firstChild);
    };

    const scaleCard = document.createElement("div");
    scaleCard.classList.add("scale-card");
    scaleCard.id = Date.now();
    scaleCard.innerHTML = `<div class="card-tag">Resized</div>`;

    function appendUserVals() {
      const scaleContent = document.createElement("div");
      scaleContent.classList.add("scale-content");
      scaleContent.innerHTML = `
        <h2>${recipeName}</h2>
        <p>Serves: ${convertToFraction(conversionFactor())}</p>
        <h3>Ingredients</h3>`;

      // Loop through each user value
      result.forEach((row) => {
        const newItem = document.createElement("div");
        newItem.classList.add("scaled-row");
        // Set the text of the new item to the user value
        newItem.innerHTML = `
          <input type="checkbox" name="ing-check" disabled></input>
          <span>${convertToFraction(row.qty)}</span>
          <span>${row.meas}</span>
          <span>${row.name}</span>`
        scaleContent.append(newItem);
      })
      scaleCard.appendChild(scaleContent);
      const animation = scaleCard.animate(
        [{ transform: 'translateY(25px)' }, { transform: 'translateY(0px)' }],
        {
          duration: 700,
          iterations: 1,
          direction: 'normal',
          easing: 'ease-in-out',
        }
      );
      return scaledContainer.appendChild(scaleCard);
    }
    return appendUserVals(result);
  }
})

const deleteButton = document.querySelectorAll(".delete-btn");

// Clear contents of row
deleteButton.forEach((del) => {
  del.addEventListener("click", (e) => {
    e.preventDefault();
    const parentRow = e.target.parentElement;

    parentRow.children[0].value = "";
    parentRow.children[1].value = "pick-type"
    parentRow.children[2].value = "";
  })
})
