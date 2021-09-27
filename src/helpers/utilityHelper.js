export function toAmount(amt) {
  return Number.parseFloat(amt).toFixed(2);
}
export function toCurrency(amt) {
  return "$" + toAmount(amt);
}
