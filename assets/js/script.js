const addIngBtn = document.querySelector("#add-row-btn");
const ingInput = document.querySelector(".ingredient-inputs");
const ingRow = ingInput.children[1];

// Duplicate ingredients row on button click
let i = 3;
addIngBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (++i > 8) return;

  // Clone the first row of input
  const clone = ingRow.cloneNode(true);

  // Remove 'ing-1' from classes & add current clone number to row class
  clone.classList.remove("ing-1");
  clone.classList.add("ing-" + i);

  // Change the number text by setting the fieldset's textContent
  clone.children[0].value = "";
  clone.children[2].value = "";

  // Set the names of the inputs and select
  clone.children[0].name = "qty-" + i;
  clone.children[1].name = "meas-" + i;
  clone.children[2].name = "ing-name-" + i;

  clone.children[0].id = "qty-" + i;
  clone.children[1].id = "meas-" + i;
  clone.children[2].id = "ing-name-" + i;

  // Add the new fieldset to the container
  ingInput.appendChild(clone);
  console.log(clone);
});

const submitBtn = document.querySelector("#submit-form");
const recipeName = document.querySelector("#recipe-name");

// Calculate scaled recipe by portions on button click
submitBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const scaledContainer = document.querySelector(".scale-field");

  const conversionFactor = () => {
    const ogPortion = document.querySelector("#og-portion").value;
    const scaledPortion = document.querySelector("#scaled-portion").value;
    const cf = scaledPortion / ogPortion;
    return cf;
  };
  console.log("The Conversion Factor is " + conversionFactor() + ".");

  // Get all filled out ingredients
  const quantity = [...document.querySelectorAll(".quantity")];
  const filteredQuantity = quantity
    .filter(q => q.value.trim() !== "")
    .map(q => q.value);
  console.log(`Filtered Qty: ${filteredQuantity}`);

  const measure = [...document.querySelectorAll(".measure")];
  const filteredMeasure = measure
    //.filter(m => m.value.trim() !== "pick-type")
    .map(m => m.value);
  console.log(filteredMeasure);

  const ingName = [...document.querySelectorAll(".ing-name")];
  const filteredIngName = ingName
    //.filter(i => i.value.trim() !== "")
    .map(i => i.value);
    console.log(filteredIngName);

  // Multiply each quantity by conversionFactor
  const solveCF = filteredQuantity.map(f => f * conversionFactor())
  console.log(solveCF);

  const result = solveCF.map((cf, index) => {
    return {
      qty: cf,
      meas: filteredMeasure[index],
      ingName: filteredIngName[index]
    };
  });
  console.log(result);

  function appendUserVals(userInput) {
    const scaleCard = document.createElement("div");
    scaleCard.classList.add("scale-card");
    scaleCard.innerHTML = `<h2>${recipeName}</h2>`;

    // Loop through each user value
    result.forEach((row) => {
      const newItem = document.createElement("div");
      newItem.classList.add("scaled-row");
      // Set the text of the new item to the user value
      newItem.innerHTML = `
        <span>${row.qty}</span>
        <span>${row.meas}</span>
        <span>${row.ingName}</span>`
      scaleCard.append(newItem);
    })
    return scaledContainer.appendChild(scaleCard);
  }
  appendUserVals(result);
})

const deleteButton = document.querySelectorAll(".delete-btn");

// Clear contents of row
deleteButton.forEach((del) => {
  del.addEventListener("click", (e) => {
    const parentRow = e.target.parentElement;

    parentRow.children[0].value = "";
    parentRow.children[1].value = "pick-type"
    parentRow.children[2].value = "";
  })
})
