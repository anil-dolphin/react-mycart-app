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
          <button
            type="button"
            className="delete"
            onClick={() => removeQuantity(product.entity_id)}
          >
            <svg
              className="delete-icon"
              svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 30 30"
              width="20"
            >
              <g>
                <path d="M2.55566,7.33789c0,0.82813,0.67139,1.5,1.5,1.5h0.80078v17.72559c0,2.72168,2.21436,4.93652,4.93604,4.93652h12.41504   c2.72168,0,4.93604-2.21484,4.93604-4.93652V8.83789h0.80078c0.82861,0,1.5-0.67188,1.5-1.5s-0.67139-1.5-1.5-1.5h-5.24951V4.29102   c0-2.09082-1.7002-3.79102-3.79053-3.79102H13.0957c-2.09033,0-3.79053,1.7002-3.79053,3.79102v1.54688H4.05566   C3.22705,5.83789,2.55566,6.50977,2.55566,7.33789z M12.30518,4.29102c0-0.43652,0.35449-0.79102,0.79053-0.79102h5.80859   c0.43604,0,0.79053,0.35449,0.79053,0.79102v1.54688h-7.38965V4.29102z M7.85645,8.83789h16.28711v17.72559   c0,1.06738-0.86865,1.93652-1.93604,1.93652H9.79248c-1.06738,0-1.93604-0.86914-1.93604-1.93652V8.83789z" />
                <path d="M12.27246,25.7373c0.82861,0,1.5-0.67188,1.5-1.5V13.10059c0-0.82813-0.67139-1.5-1.5-1.5s-1.5,0.67188-1.5,1.5V24.2373   C10.77246,25.06543,11.44385,25.7373,12.27246,25.7373z" />
                <path d="M19.72754,25.7373c0.82861,0,1.5-0.67188,1.5-1.5V13.10059c0-0.82813-0.67139-1.5-1.5-1.5s-1.5,0.67188-1.5,1.5V24.2373   C18.22754,25.06543,18.89893,25.7373,19.72754,25.7373z" />
              </g>
            </svg>
          </button>

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
