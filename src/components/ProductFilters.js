import React from "react";

class ProductFilters extends React.Component {
  render() {
    return (
      <div className="address_list_product table">
        <div className="multishipping_filters_cart" id="cart_filters">
          <div className="one_filter_cart_title">Products</div>
          <div className="one_filter_cart product_filter_header">
            <div className="category-list" style={{ paddingTop: 0 }}>
              <select id="filter_by_category" multiple="" aria-hidden="true">
                <option value="414">Audio</option>
                <option value="480">Cables</option>
                <option value="7280">Car Mounts</option>
                <option value="450">Cases</option>
                <option value="567">Mount</option>
                <option value="393">Power</option>
                <option value="462">Screen Protection</option>
              </select>
            </div>
            <div className="product-attr-list">
              <select id="filter_by_make" aria-hidden="true">
                <option value="0">Make</option>
                <option value="24">Apple</option>
                <option value="279">Samsung</option>
              </select>
            </div>
            <div className="product-attr-list">
              <select id="filter_by_model" disabled="" aria-hidden="true">
                <option value="0">Model</option>
              </select>
            </div>
            <div className="filter_product_search_wrapper">
              <input
                type="text"
                name="search"
                placeholder="Search Products"
                id="search_products"
              />
            </div>
            <div className="product-attr-list">
              <select id="filter_by_brand" aria-hidden="true">
                <option value="0">Brands</option>
                <option value="399">NCredible</option>
                <option value="432">Nimbus9</option>
                <option value="279">PureGear</option>
                <option value="1087">Tech21</option>
              </select>
            </div>
          </div>
          <div className="one_filter_cart location_qty_filter_header">
            <div className="location_list_clear_filter">
              <a
                href="javascript:"
                id="clear_filters"
                className="simple-but red-but"
              >
                Clear Filters
              </a>
            </div>
          </div>
        </div>

        <div className="table-header">
          <div className="row-table">
            <div className="col col-9">Product Descripton</div>
            <div className="col col-7 align-right">Purchase Orders</div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProductFilters;
