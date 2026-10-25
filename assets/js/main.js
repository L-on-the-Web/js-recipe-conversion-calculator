import convertToFraction from "./fractions.js";
import formValidation from "./formValidation.js";

function submitForm() {
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
  const isValid = formValidation(formData);
  const scaledContainer = document.querySelector(".scale-field");

  if (isValid) {
    scaledContainer.id = `Result-${Date.now()}`
    printBtn.style.display = "block";

    const conversionFactor = () => {
      const cf = scaledPortion / ogPortion;
      const displayCF = Number(cf.toFixed(2));
      return displayCF;
    };
    console.log(`The Conversion Factor is ${conversionFactor()}.`);

    // Multiply each quantity by conversionFactor
    const result = filteredQuantity.map((f, index) => {
      const cf = f * conversionFactor();
      return {
        qty: cf,
        meas: filteredMeasure[index],
        name: sanitizeInput[index]
      }
    });

    const ingObject = filteredQuantity.map((f, index) => {
      return {
        qty: f,
        meas: filteredMeasure[index],
        name: sanitizeInput[index]
      }
    });

    if (scaledContainer.firstChild) {
      const cards = document.querySelectorAll(".scale-card");
      cards.forEach(c => {
        c.remove();
      })
    };

    function createCards() {
      const scaleCard = document.createElement("div");
      scaleCard.classList.add("scale-card");
      scaleCard.innerHTML = `<div class="new-tag">Resized</div>`;

      const scaleContent = document.createElement("div");
      scaleContent.classList.add("scale-content");
      scaleContent.innerHTML = `
        <h2>${recipeName}</h2>
        <p>Serves: ${convertToFraction(conversionFactor())}</p>
        <h3>Ingredients</h3>`;

      result.forEach((row) => {
        const newItem = document.createElement("div");
        newItem.classList.add("scaled-row");
        // Each row is the new value
        newItem.innerHTML = `
          <input type="checkbox" name="ing-check" disabled></input>
          <span>${convertToFraction(row.qty)}</span>
          <span>${row.meas}</span>
          <span>${row.name}</span>`
          scaleContent.append(newItem);
      });
      scaleCard.appendChild(scaleContent);

      const oldCard = document.createElement("div");
      oldCard.classList.add("scale-card");
      oldCard.innerHTML = `<div class="old-tag">Original</div>`;

      const oldContent = document.createElement("div");
      oldContent.classList.add("scale-content");
      oldContent.innerHTML = `
        <h2>${recipeName}</h2>
        <p>Serves: ${ogPortion}</p>
        <h3>Ingredients</h3>`;
      oldCard.appendChild(oldContent);

      ingObject.forEach((row) => {
        const newItem = document.createElement("div");
        newItem.classList.add("scaled-row");
        // Each row is the og value
        newItem.innerHTML = `
          <input type="checkbox" name="ing-check" disabled></input>
          <span>${row.qty}</span>
          <span>${row.meas}</span>
          <span>${row.name}</span>`
          oldContent.append(newItem);
      });

      const printAnimation = printBtn.animate(
        [{ transform: 'translateY(25px)' }, { transform: 'translateY(0px)' }],
        {
          duration: 700,
          iterations: 1,
          direction: 'normal',
          easing: 'ease-in-out',
        }
      );

      const newAnimation = scaleCard.animate(
        [{ transform: 'translateY(25px)' }, { transform: 'translateY(0px)' }],
        {
          duration: 700,
          iterations: 1,
          direction: 'normal',
          easing: 'ease-in-out',
        }
      );

      const oldAnimation = oldCard.animate(
        [{ transform: 'translateY(25px)' }, { transform: 'translateY(0px)' }],
        {
          duration: 700,
          iterations: 1,
          direction: 'normal',
          easing: 'ease-in-out',
        }
      );
      return scaledContainer.append(scaleCard, oldCard);
    }
    return createCards(result);
  }
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

  // Add current clone number to row class
  clone.id = "ing-" + i;

  // Change empty current text
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
const printBtn = document.querySelector("#print-btn");
const deleteButton = document.querySelectorAll(".delete-btn");

// Calculate scaled recipe on button click
submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  submitForm();
})

printBtn.addEventListener("click", (e) => {
  e.preventDefault();
  window.print();
})

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
