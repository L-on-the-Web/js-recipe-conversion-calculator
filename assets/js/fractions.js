// Helper function to find Greatest Common Divisor
function getGCD(a, b) {
  return b ? getGCD(b, a % b) : a;
}

export default function convertToFraction(decimal) {
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
