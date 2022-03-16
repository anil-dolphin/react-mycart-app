import { getCurrency } from "./dataHelper";

export function toAmount(amt) {
  return Number.parseFloat(amt).toFixed(2);
}
export function toCurrency(amt) {
  // return getCurrency() + toAmount(amt);
  return (
    getCurrency() +
    Number.parseFloat(toAmount(amt)).toLocaleString("en-US", {
      minimumFractionDigits: 2,
    })
  );
}
export function toQty(qty) {
  return Number.parseInt(qty, 10);
}
