import React, { useState } from "react";
import { toCurrency } from "../helpers/utilityHelper";

const ProductBlock = ({ product, setQuantity, removeQuantity }) => {
  const [productQuantity, setProductQuantity] = useState({});

  const allocateQuantity = (productId) => {
    if (productId === productQuantity.productId) {
      setQuantity({ productId, qty: parseInt(productQuantity.qty) });
      setProductQuantity({ qty: "" });
    } else {
      setQuantity({ productId, qty: 0 });
    }
  };

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
            <button
              type="button"
              data-bind="i18n: 'Remove'"
              onClick={() => removeQuantity(product.entity_id)}
            >
              D
            </button>
          </a>
          <button
            className="simple-but red-but add_product_qty"
            type="button"
            onClick={() => allocateQuantity(product.entity_id)}
          >
            »
          </button>
          <input
            type="number"
            size="4"
            id={product.entity_id}
            min={0}
            max={1000}
            className="pqty"
            value={productQuantity.qty}
            onChange={(e) => {
              setProductQuantity({
                qty: e.target.value,
                productId: product.entity_id,
              });
            }}
          />
        </div>
      </div>
      <div className="col col-3 single-price align-center">
        {toCurrency(product.price)}
      </div>
    </div>
  );
};

export default ProductBlock;
