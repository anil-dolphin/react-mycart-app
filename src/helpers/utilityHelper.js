export function toAmount(amt) {
  return Number.parseFloat(amt).toFixed(2);
}
export function toCurrency(amt) {
  return "$" + toAmount(amt);
}
export function toQty(qty) {
  return Number.parseInt(qty, 10);
}
