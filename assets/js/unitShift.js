// Base units (teaspoon)
export const conversions = [
  { unit: 'gallon', name: 'Gallons', min: 0.25, fromBase: 768 },
  { unit: 'quart', name: 'Quarts', min: 0.5, fromBase: 192 },
  { unit: 'pint', name: 'Pints', min: 0.5, fromBase: 96 },
  { unit: 'cup', name: 'Cups', min: 0.25, fromBase: 48 },
  { unit: 'ounce', name: 'Ounces', min: 1, fromBase: 6 },
  { unit: 'tablespoon', name: 'Tablespoons', min: 1, fromBase: 3 },
  { unit: 'teaspoon', name: 'Teaspoons', min: 0, fromBase: 1 },
  { unit: 'c', name: 'Cups', min: 0.25, fromBase: 1 }, // Base set to 1 to not convert dry unit
  { unit: 'pound', name: 'Pounds', min: 1, fromBase: 1 }, // Base set to 1 to not convert dry unit
  { unit: 'each', name: 'Each', min: 1, fromBase: 1 }, // Base set to 1 to not convert dry unit
  { unit: 'pinch', name: 'Pinches', min: 1, fromBase: 0.0625 },
  { unit: 'dash', name: 'Dashes', min: 1, fromBase: 0.125 }
];

// Convert user input to base unit (teaspoons)
function toTeaspoons(qty, unitName) {
  // Multipy filteredQuantity by conversions[unit].fromBase to convert to teaspoons
  const unitToTsp = conversions.find(u => u.unit === unitName);
  const n = unitToTsp.fromBase;

  if (n !== 1) {
    console.log(`Converting '${qty} ${unitToTsp.name}' to '${qty * unitToTsp.fromBase} Teaspoons'.`);
  } else {
    console.log(`Cannot convert '${qty} ${unitToTsp.name}' to Teaspoons.`);
  }

  return unitToTsp ? qty * unitToTsp.fromBase : null;
}

// Smart unit shifting
export default function shiftUnit(tspAmount, unitName) {
  tspAmount = toTeaspoons(tspAmount, unitName);
  const unitToTsp = conversions.find(u => u.unit === unitName);
  const n = unitToTsp.fromBase;

  // Divide converted teaspoons by each conversion.fromBase starting from top of array
  for (const unit of conversions) {
    const convertedAmount = tspAmount / unit.fromBase;
    //console.log(`${convertedAmount} ${unit.name}`);

    if (n === 1) {
      return {
        amount_1: tspAmount,
        unit_1: unitToTsp.name
      };
    };

    if (convertedAmount >= unit.min) {
      // Match to closest fraction
      const acceptedFractions = [0.25, 0.333, 0.5, 0.667, 0.75, 1];

      for (const [index, curr] of acceptedFractions.entries()) {
        let compare = convertedAmount < curr;
        //console.log(compare);
        if (compare) {
          const largeAmount = convertedAmount - acceptedFractions[index - 1];
          const smallAmount = shiftUnit(largeAmount, unit.unit);
          return {
            amount_1: `${acceptedFractions[index - 1]}`,
            unit_1: `${unit.name}`,
            amount_2: `${smallAmount.amount_1}`,
            unit_2: `${smallAmount.unit_1}`
          };
        }
      }
      return {
        amount_1: `${convertedAmount}`,
        unit_1: unit.name
      };
    }
  }
  // Fallback to teaspoons
  const smallest = conversions[conversions.length - 1];
  return { amount_1: tspAmount / smallest.toBase, unit_1: smallest.name };
}
