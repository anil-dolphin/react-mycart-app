import React from "react";
import { toCurrency } from "../helpers/utilityHelper";

class ProductBlock extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.loaderRef = React.createRef();
  // }

  render() {
    const { product } = this.props;

    return (
      <div className="row-table product">
        <div className="col col-2 img-product border-right">
          <a href={product.product_url}>
            <img src={product.image} alt={product.sku} />
          </a>
        </div>
        <div className="col col-7 product_url">
          <a href="https://scp.demoproject.info/index.php/default/ncredible-ncredible-n2-ote-blk-gntml-audio-62646nc.html">
            <span className=""></span>
            <p title={product.name}>{product.name}</p>
          </a>
        </div>
        <div className="col col-4">
          <div className="product_action">
            <a
              href="#"
              className="action delete"
              data-cart-item="6000"
              title="Remove item"
            >
              <span data-bind="i18n: 'Remove'">Remove</span>
            </a>
            <button className="simple-but red-but add_product_qty">»</button>
            <input type="number" size="4" min={0} max={1000} className="pqty" />
          </div>
        </div>
        <div className="col col-3 single-price align-center">
          {toCurrency(product.price)}
        </div>
      </div>
    );
  }
}

export default ProductBlock;
