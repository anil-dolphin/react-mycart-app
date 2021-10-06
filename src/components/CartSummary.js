import React from "react";
import { toCurrency } from "../helpers/utilityHelper";

class CartSummary extends React.Component {
  render() {
    return (
      <div className="total_block_data">
        <div className="row">
          <span className="label">Subtotal:</span>
          <span className="value" id="subtotal_val">
            {toCurrency(
              this.props.summary.subtotal ? this.props.summary.subtotal : 0
            )}
          </span>
        </div>

        <div className="row">
          <span className="label">Tax:</span>
          <span className="value" id="tax_val">
            {toCurrency(this.props.summary.tax ? this.props.summary.tax : 0)}
          </span>
        </div>

        <div className="row full-total">
          <span className="label">Total:</span>
          <span className="value" id="total_val">
            {toCurrency(
              this.props.summary.grand_total
                ? this.props.summary.grand_total
                : 0
            )}
          </span>
        </div>
        <div
          className={`row full-total action-buttons ${
            this.props.stickFooter ? "sticky-bottom" : ""
          }`}
        >
          <button
            className="round-but active-but update_order_but"
            disabled={!this.props.allowUpdate}
            onClick={this.props.updateOrder}
          >
            Update Order
          </button>
          <a
            href="https://scp.demoproject.info/index.php/default/multishipping/checkout/shipping/"
            className="round-but active-but place-order"
            id="go_to_shipping"
          >
            Select shipping
          </a>
        </div>
      </div>
    );
  }
}

export default CartSummary;
