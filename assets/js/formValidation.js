export default function formValidation(formData) {
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

  const ingForm = filteredQuantity.map((qty, index) => {
    return [ qty, filteredMeasure[index], sanitizeInput[index] ];
  });

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
