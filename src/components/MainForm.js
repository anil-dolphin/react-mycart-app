import React from "react";
import ProductFilters from "./ProductFilters";
import LocationFilters from "./LocationFilters";
import ProductBlock from "./ProductBlock";
import Pagination from "react-js-pagination";
import Pagin from "./pagination";
import _ from "lodash";

import {
  getProducts,
  getLocations,
  getProdLocQty,
} from "../helpers/dataHelper";
import { toCurrency } from "../helpers/utilityHelper";

class MainForm extends React.Component {
  state = {
    isLoading: true,
    prodLocQty: {},
    total: { products: [], locations: [], grand: 0 },
    locations: {},
    products: {},
    productsPagination: { limit: 10, page: 1, totalPage: 0 },
    locationsPagination: { limit: 6, page: 1, totalPage: 0 },
  };

  renderProducts = () => {
    const { products } = this.state;

    return Object.values(products).map((product) => {
      return (
        <ProductBlock
          product={product}
          setQuantity={this.setProductQuantity}
          removeQuantity={this.removeProductQuantity}
          key={product.entity_id}
        />
      );
    });
  };

  setProductQuantity = (data) => {
    const { locations } = this.state;
    return Object.values(locations).map((location) => {
      this.setQty(data.productId, location.id, data.qty);
    });
  };

  removeProductQuantity = (productId) => {
    const { locations } = this.state;
    return Object.values(locations).map((location) => {
      this.setQty(productId, location.id, 0);
    });
  };

  renderQtyInputsRows = () => {
    const products = this.state.products;
    return Object.values(products).map((product) => {
      return (
        <div
          className="row-table product-locations"
          key={`p${product.entity_id}`}
        >
          {this.renderQtyInputsRow(product.entity_id)}
        </div>
      );
    });
  };

  renderQtyInputsRow = (productId) => {
    const locations = this.state.locations;
    return Object.values(locations).map((location) => {
      return (
        <div
          className="col col-31 border-right"
          key={`p${productId}l${location.id}`}
        >
          {this.renderQtyInput(productId, location.id)}
        </div>
      );
    });
  };

  renderQtyInput = (productId, locationId) => {
    const { prodLocQty } = this.state;
    let qty = 0;
    if (
      prodLocQty[productId] &&
      prodLocQty[productId][locationId] &&
      prodLocQty[productId][locationId]["qty"]
    ) {
      qty = prodLocQty[productId][locationId]["qty"];
    }
    return (
      <input
        type="number"
        size="4"
        min={0}
        max={1000}
        className={qty > 0 && "has-qty"}
        value={qty}
        data-role="cart-item-qty"
        onChange={(event) => {
          this.setQty(
            productId,
            locationId,
            event.target.value == "" || isNaN(event.target.value)
              ? 0
              : parseInt(event.target.value, 10)
          );
        }}
      />
    );
  };

  generateTotals = () => {
    const { prodLocQty } = this.state;
    const products = this.state.products;
    var grandTotal = 0,
      pTotals = [],
      lTotals = [];

    // if (
    //   Object.keys(prodLocQty).length != 0 &&
    //   Object.keys(products).length != 0
    // ) {
    Object.keys(prodLocQty).map((productId) => {
      const price = products[productId].price;
      Object.keys(prodLocQty[productId]).map((locationId) => {
        const qty = prodLocQty[productId][locationId]["qty"];
        const total = qty * price;
        if (pTotals[productId]) {
          pTotals[productId]["price"] += total;
          pTotals[productId]["qty"] += qty;
        } else {
          pTotals[productId] = { price: total, qty: qty };
        }

        if (lTotals[locationId]) {
          lTotals[locationId]["price"] += total;
          lTotals[locationId]["qty"] += qty;
        } else {
          lTotals[locationId] = { price: total, qty: qty };
        }

        grandTotal += total;
      });
    });
    // }

    this.setState({
      total: { products: pTotals, locations: lTotals, grand: grandTotal },
    });
  };

  renderProductTotals = () => {
    const productsTotal = this.state.total.products;
    const products = this.state.products;

    return Object.values(products).map((product) => {
      const total = productsTotal[product.entity_id]
        ? productsTotal[product.entity_id]["price"]
        : 0;

      return (
        <div className="total_row" key={`ptotal${product.entity_id}`}>
          {toCurrency(total)}
        </div>
      );
    });
  };

  /**
   * Unused function
   */
  getProductTotal = (productId) => {
    const { prodLocQty } = this.state;
    const products = this.state.products;

    var total = 0;
    if (prodLocQty[productId]) {
      const price = products[productId].price;
      Object.values(prodLocQty[productId]).map((location) => {
        total += price * location["qty"];
      });
    }
    return total;
  };

  renderLocationTotals = () => {
    const locationsTotal = this.state.total.locations;
    const locations = this.state.locations;

    return Object.values(locations).map((location) => {
      const total = locationsTotal[location.id]
        ? locationsTotal[location.id]["price"]
        : 0;

      return (
        <div
          className="col col-31 border-right total-column"
          data-lid="207"
          key={`ltotal${location.id}`}
        >
          <span>{toCurrency(total)}</span>
        </div>
      );
    });
  };

  setQty = (productId, locationId, qty) => {
    const prodLocQty = this.state.prodLocQty;

    if (!prodLocQty[productId]) {
      prodLocQty[productId] = { [locationId]: { qty: parseInt(qty, 10) } };
    } else {
      prodLocQty[productId][locationId] = { qty: parseInt(qty, 10) };
    }
    this.setState({ prodLocQty: prodLocQty });
    this.generateTotals();
  };

  testClick = (e) => {
    e.preventDefault();
    this.generateTotals();
  };

  componentDidMount = () => {
    let promise1 = new Promise((resolve, reject) => {
      getProdLocQty().then((data) => {
        this.setState({ prodLocQty: data });
        if (data) {
          resolve(data);
        }
      });
    });
    let promise2 = new Promise((resolve, reject) => {
      getLocations(
        this.state.locationsPagination.page,
        this.state.locationsPagination.limit
      ).then((data) => {
        this.setState({ locations: _.mapKeys(data.locations, "id") });
        this.setState({
          locationsPagination: {
            limit: data.limit,
            page: data.page,
            totalPage: data.total,
          },
        });
        if (data) {
          resolve(data);
        }
      });
    });
    let promise3 = new Promise((resolve, reject) => {
      getProducts(
        this.state.productsPagination.page,
        this.state.productsPagination.limit
      ).then((data) => {
        this.setState({ products: _.mapKeys(data.products, "entity_id") });
        this.setState({
          productsPagination: {
            limit: data.limit,
            page: data.page,
            totalPage: data.total,
          },
        });

        if (data) {
          resolve(data);
        }
      });
    });

    Promise.all([promise1, promise2, promise3])
      .then((values) => {
        if (values) {
          this.setState({ isLoading: false });
          this.generateTotals();
        }
      })
      .catch(function (err) {
        console.log("Error", err);
      });
  };

  handleProductPagination = (pageNumber) => {
    getProducts(pageNumber, this.state.productsPagination.limit).then(
      (data) => {
        this.setState({ products: _.mapKeys(data.products, "entity_id") });

        this.setState({
          productsPagination: {
            limit: data.limit,
            page: data.page,
            totalPage: data.total,
          },
        });
      }
    );
  };

  handleLocationPagination = (pageNumber) => {
    getLocations(pageNumber, this.state.locationsPagination.limit).then(
      (data) => {
        this.setState({ locations: _.mapKeys(data.locations, "id") });
        this.setState({
          locationsPagination: {
            limit: data.limit,
            page: data.page,
            totalPage: data.total,
          },
        });
      }
    );
  };

  render() {
    if (this.state.isLoading) return <div>Loading...</div>;
    // console.log(this.state.locations);

    return (
      <form id="product_cart_form" className="form multicheckout shipping test">
        {/* <button onClick={this.testClick}>Test</button> */}
        <div className="multishipping_cart_wrapper">
          <div className="multishipping_cart_header" style={{ top: 0 }}>
            <ProductFilters />
            <LocationFilters locations={this.state.locations} />
            <div className="address_list_total table_grand_total_by_sku">
              <div className="total_label">Extended</div>
            </div>
          </div>

          <div className="multishipping_cart_body">
            <div className="address_list_product table">
              <div className="table-body" id="by_sku_product">
                {this.renderProducts()}
              </div>
              {this.state.productsPagination.totalPage > 10 && (
                <div className="pagination">
                  <Pagination
                    activePage={this.state.productsPagination.page}
                    itemsCountPerPage={this.state.productsPagination.limit}
                    totalItemsCount={this.state.productsPagination.totalPage}
                    pageRangeDisplayed={5}
                    onChange={this.handleProductPagination}
                  />
                </div>
              )}
            </div>

            <div className="address_list_qty">
              <div className="location_list_qty_table_wrapper">
                <div className="arrows prev disabled">P</div>
                <div className="address_list_slider">
                  <div
                    className="address_list_qty_table by_sku_locations_table qty_manager table"
                    data-page="0"
                    style={{ left: 0, width: "100%" }}
                  >
                    <div className="table-body" id="location_qty_by_sku">
                      {this.renderQtyInputsRows()}
                    </div>
                    {this.state.locationsPagination.totalPage > 6 && (
                      <div className="pagination">
                        <Pagin
                          activePage={this.state.locationsPagination.page}
                          itemsCountPerPage={
                            this.state.locationsPagination.limit
                          }
                          totalItemsCount={
                            this.state.locationsPagination.totalPage
                          }
                          pageRangeDisplayed={5}
                          handleClick={this.handleLocationPagination}
                          component="location"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="arrows next disabled">N</div>
              </div>
            </div>

            <div className="address_list_total table_grand_total_by_sku">
              <div id="table_grand_total_by_sku">
                {this.renderProductTotals()}
                {/* <div className="total_row" data-pid="6000">
                  $0.00
                </div>
                <div className="total_row" data-pid="7783">
                  $243.00
                </div>
                <div className="total_row" data-pid="7762">
                  $128.00
                </div> */}
              </div>
            </div>
          </div>

          <div
            className="multishipping_cart_footer sticky-bottom"
            style={{ width: "1570px", padding: "0px 170px" }}
          >
            <div className="address_list_product table">
              <div className="table-body">
                <div className="row-table table-header">
                  <div className="col col-2"></div>
                  <div className="col col-7"></div>
                  <div className="col col-7 align-right">Store Totals :</div>
                </div>
              </div>
            </div>

            <div className="address_list_qty">
              <div className="location_list_qty_table_wrapper">
                <div className="arrows prev disabled">P</div>
                <div className="address_list_slider">
                  <div className="address_list_qty_table by_sku_locations_table table">
                    <div className="table-body" id="location_total_by_sku">
                      <div className="row-table locations-total">
                        {this.renderLocationTotals()}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="arrows next disabled">N</div>
              </div>
            </div>

            <div className="address_list_total table_grand_total_by_sku">
              <div className="table_grand_total" id="table_grand_total">
                {toCurrency(this.state.total.grand)}
              </div>
            </div>
          </div>
        </div>

        <div className="multishipping_footer">
          <div className="exel-part">
            <h3>Prefer Excel?</h3>
            <p>
              Download your current cart as a spreadsheet, update the quantities
              and we will create a shopping cart for you.
            </p>

            <div className="import-execel-wrapper">
              <label htmlFor="import_excel" className="round-but black-but">
                Import Order Data
              </label>
              <label htmlFor="import_excel_new" className="round-but black-but">
                Import from POS
              </label>
            </div>
            <div className="exel-part-action">
              <div className="download-link">
                <a
                  href="https://scp.demoproject.info/index.php/default/customer/cart/export/"
                  className="round-but active-but this_data_excel"
                >
                  Download Current Cart
                </a>
                <a
                  href="https://scp.demoproject.info/index.php/default/customer/cart/exportTemplate/"
                  className="round-but active-but this_template_excel"
                >
                  Download Sample Cart Import
                </a>
              </div>
              <div className="download-link">
                <a
                  href="https://scp.demoproject.info/media/sample/rtpos_sample.xlsx"
                  target="_blank"
                >
                  Download POS Sample
                </a>
                <a
                  href="https://scp.demoproject.info/media/sample/ci_sample.xlsx"
                  target="_blank"
                >
                  Download Suggested Order Sample
                </a>
                <a
                  href="https://scp.demoproject.info/media/sample/di_sample.xlsx"
                  target="_blank"
                >
                  Download Order Import Sample
                </a>
              </div>
            </div>
            <div className="execel-link-wrapper">
              <div className="download-content">
                <p>
                  <strong>Notes:</strong>
                </p>
                <ul>
                  <li>Files must be in xlsx format only.</li>
                  <li>
                    Please use the column headers found in the upload sample
                    file that matches your input file.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="total_block">
            <div className="total_block_data">
              <div className="row">
                <span className="label" style={{ opacity: 0.3 }}>
                  Subtotal:
                </span>
                <span
                  className="value"
                  id="subtotal_val"
                  style={{ opacity: 0.3 }}
                >
                  $527.00
                </span>
              </div>

              <div className="row">
                <span className="label" style={{ opacity: 0.3 }}>
                  Tax:
                </span>
                <span className="value" id="tax_val" style={{ opacity: 0.3 }}>
                  $0.00
                </span>
              </div>

              <div className="row full-total">
                <span className="label" style={{ opacity: 0.3 }}>
                  Total:
                </span>
                <span className="value" id="total_val" style={{ opacity: 0.3 }}>
                  $527.00
                </span>
              </div>

              <div className="row full-total action-buttons sticky-bottom">
                <button
                  className="round-but active-but update_order_but disabled_but"
                  id="update_order"
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
          </div>
        </div>
      </form>
    );
  }
}

export default MainForm;
