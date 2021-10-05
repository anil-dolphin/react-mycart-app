import React from "react";
import ProductFilters from "./ProductFilters";
import LocationFilters from "./LocationFilters";
import ProductBlock from "./ProductBlock";
import Loader from "./Loader";
import Pagination from "react-js-pagination";
import Pagin from "./pagination";
import _ from "lodash";

import {
  getProducts,
  getLocations,
  getProdLocQty,
  updateQtys,
  updatePos,
} from "../helpers/dataHelper";
import { toCurrency } from "../helpers/utilityHelper";

class MainForm extends React.Component {
  constructor(props) {
    super(props);
    this.prevProdLocQty = {};
    this.prevLocPo = {};

    this.stickyFooter = React.createRef();
    this.refMyCartBody = React.createRef();
  }

  state = {
    isLoading: true,
    prodLocQty: {},
    locPo: {},
    total: { products: [], locations: [], grand: 0 },
    locations: {},
    products: {},
    productsPagination: { limit: 10, page: 1, totalPage: 0 },
    locationsPagination: { limit: 6, page: 1, totalPage: 0 },
    productFilters: {
      kw: "",
      categories: [],
      make: 0,
      model: 0,
      brand: 0,
    },
    locationFilters: {
      kw: "",
      region: "",
      state: 0,
      city: "",
      applyQty: false,
      qty: "gtz",
    },
    loader: {
      show: false,
      title: "Please wait",
      content: "Loading...",
    },
    stickHeader: false,
    stickFooter: false,
  };

  /**
   * Renderers
   */

  renderProducts = () => {
    const { products } = this.state;

    if (_.isEmpty(products)) {
      return <div className="no-data-found">No products found</div>;
    } else {
      return Object.values(products).map((product) => {
        return (
          <ProductBlock
            product={product}
            setQuantity={this.setQtyMultiple}
            removeQuantity={this.removeQtyMultiple}
            key={product.entity_id}
          />
        );
      });
    }
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
    let qty = 0,
      pqty = null,
      cssClass = "";
    if (prodLocQty[productId] && prodLocQty[productId][locationId]) {
      qty = prodLocQty[productId][locationId]["qty"];
    }
    cssClass = qty > 0 ? "has-qty" : "";

    if (
      this.prevProdLocQty[productId] &&
      this.prevProdLocQty[productId][locationId]
    ) {
      pqty = this.prevProdLocQty[productId][locationId]["qty"];
      cssClass = qty != pqty ? cssClass + " qty-changed" : cssClass;
    } else {
      cssClass = qty > 0 ? "has-qty qty-changed" : "";
    }

    return (
      <input
        type="number"
        size="4"
        min={0}
        max={1000}
        className={cssClass}
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

  /**
   * Operations
   */

  generateTotals = () => {
    const { prodLocQty } = this.state;
    const products = this.state.products;
    var grandTotal = 0,
      pTotals = [],
      lTotals = [];

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

    this.setState({
      total: { products: pTotals, locations: lTotals, grand: grandTotal },
    });
  };

  getQtyWithCap = (productId, locationId, qty) => {
    const products = this.state.products;
    const productsTotal = this.state.total.products;
    const prodLocQty = this.state.prodLocQty;
    const product = products[productId];
    let qtyAdded = 0;
    if (productsTotal[productId] !== undefined) {
      qtyAdded = productsTotal[productId].qty;
    }

    let cellQty =
      prodLocQty[productId] &&
      prodLocQty[productId][locationId] &&
      prodLocQty[productId][locationId]["qty"]
        ? prodLocQty[productId][locationId]["qty"]
        : 0;
    const productsTotalWoCell = qtyAdded - cellQty;
    const productsTotalTobe = productsTotalWoCell + qty;

    let qtyToSet = qty;

    const maxAllowedQty =
      Math.min(product.qty, product.max_sale_qty) > 1000
        ? 1000
        : Math.min(product.qty, product.max_sale_qty);

    if (productsTotalTobe > maxAllowedQty) {
      qtyToSet = maxAllowedQty - productsTotalWoCell;
    }

    // console.log(
    //   qty,
    //   cellQty,
    //   productsTotalWoCell,
    //   productsTotalTobe,
    //   maxAllowedQty,
    //   qtyToSet
    // );

    return parseInt(qtyToSet, 10);
  };

  setQty = (productId, locationId, qty) => {
    const qtyToSet = this.getQtyWithCap(productId, locationId, qty);
    const prodLocQty = this.state.prodLocQty;

    if (!prodLocQty[productId]) {
      prodLocQty[productId] = {
        [locationId]: { qty: qtyToSet },
      };
    } else {
      prodLocQty[productId][locationId] = { qty: qtyToSet };
    }

    // if (
    //   this.prevProdLocQty[productId] === undefined ||
    //   this.prevProdLocQty[productId][locationId] === undefined
    // ) {
    //   if (prodLocQty[productId][locationId]["qty"] == 0) {
    //     delete prodLocQty[productId][locationId];
    //   }
    //   if (_.size(prodLocQty[productId]) == 0) {
    //     delete prodLocQty[productId];
    //   }
    // }

    this.setState({ prodLocQty: prodLocQty }, () => this.generateTotals());
  };

  setQtyMultiple = (data) => {
    const { locations } = this.state;
    const currentProdLocQty = this.state.prodLocQty;
    const qtyToSet = data.qty;
    const products = this.state.products;
    const product = products[data.productId];
    const maxAllowedQty =
      Math.min(product.qty, product.max_sale_qty) > 1000
        ? 1000
        : Math.min(product.qty, product.max_sale_qty);

    let qtyArr = [];
    let qtySum = 0;
    let interval =
      Math.ceil(maxAllowedQty / qtyToSet) > _.size(locations)
        ? _.size(locations)
        : Math.ceil(maxAllowedQty / qtyToSet);
    for (let i = 0; i < interval; i++) {
      let qty = qtyToSet;
      qtySum += qtyToSet;
      if (qtySum > maxAllowedQty) {
        qty = maxAllowedQty - (qtySum - qtyToSet);
      }
      qtyArr.push(qty);
    }

    currentProdLocQty[data.productId] = {};
    let cnt = 0;
    Object.values(locations).map((location) => {
      let qty = qtyArr[cnt] !== undefined ? qtyArr[cnt] : 0;
      cnt++;
      currentProdLocQty[data.productId][location.id] = { qty: qty };
    });

    this.setState({ prodLocQty: currentProdLocQty }, () => {
      this.generateTotals();
    });
  };

  removeQtyMultiple = (productId) => {
    const currentProdLocQty = this.state.prodLocQty;
    delete currentProdLocQty[productId];
    this.setState({ prodLocQty: currentProdLocQty }, () => {
      this.generateTotals();
    });
  };

  setPO = (locationId, po) => {
    const locPo = this.state.locPo;
    locPo[locationId] = po;
    if (this.prevLocPo[locationId] === undefined && po == "")
      delete locPo[locationId];

    this.setState({ locPo: locPo });
  };

  isUpdatePending = () => {
    return !(
      _.isEmpty(this.getQtyPostData()) && _.isEmpty(this.getPoPostData())
    );
    // const { prodLocQty } = this.state;
    // const { locPo } = this.state;
    // const self = this;
    // let qtyChanged = false;

    // console.log(self.prevProdLocQty, prodLocQty);

    // _.forEach(prodLocQty, function (locations, productId) {
    //   _.forEach(locations, function (qtys, locationId) {
    //     let qty = qtys.qty;
    //     if (
    //       (self.prevProdLocQty[productId] === undefined ||
    //         self.prevProdLocQty[productId][locationId] === undefined ||
    //         self.prevProdLocQty[productId][locationId]["qty"] != qty) &&
    //       qty != 0
    //     ) {
    //       qtyChanged = true;
    //       return false;
    //     }
    //   });
    // });

    // return qtyChanged || !_.isEqual(locPo, this.prevLocPo);
  };

  updateProductFilter = async (type, value) => {
    if (this.isUpdatePending()) {
      this.setLoaderState({
        show: true,
        title: "Attention",
        content: (
          <div>
            <div>
              The changes you made in the cart will be lost. Please, click on
              Update Order before proceeding.
            </div>
            <div className="footer">
              <button
                class="round-but active-but"
                type="button"
                onClick={async () => {
                  await this.updateOrder();
                  const filters = this.state.productFilters;
                  filters[type] = value;
                  this.setState({ productFilters: filters });
                  await this.fetchProducts();
                  this.setLoaderState({
                    show: false,
                  });
                }}
              >
                <span>Update and Proceed</span>
              </button>
              <button
                class="round-but"
                type="button"
                data-role="action"
                onClick={() => {
                  this.setLoaderState({
                    show: false,
                  });
                }}
              >
                <span>Cancel</span>
              </button>
            </div>
          </div>
        ),
      });
    } else {
      const filters = this.state.productFilters;
      filters[type] = value;
      this.setState({ productFilters: filters });
      await this.fetchProducts();
    }
  };

  getProductPostData = () => {
    let productPostData = {
      brand: this.state.productFilters.brand,
      categories: !_.isEmpty(this.state.productFilters.categories)
        ? this.state.productFilters.categories.map((category) => {
            return category.id;
          })
        : [],
      kw: this.state.productFilters.kw.trim(),
      make: this.state.productFilters.make,
      model: this.state.productFilters.model,
      limit: this.state.productsPagination.limit,
      page: this.state.productsPagination.page,
    };

    return productPostData;
  };

  updateLocationFilter = async (type, value) => {
    if (this.isUpdatePending()) {
      this.setLoaderState({
        show: true,
        title: "Attention",
        content: (
          <div>
            <div>
              The changes you made in the cart will be lost. Please, click on
              Update Order before proceeding.
            </div>
            <div className="footer">
              <button
                class="round-but active-but"
                type="button"
                onClick={async () => {
                  await this.updateOrder();
                  const filters = this.state.locationFilters;
                  filters[type] = value;
                  this.setState({ locationFilters: filters });
                  await this.fetchLocations();
                  this.setLoaderState({
                    show: false,
                  });
                }}
              >
                <span>Update and Proceed</span>
              </button>
              <button
                class="round-but"
                type="button"
                data-role="action"
                onClick={() => {
                  this.setLoaderState({
                    show: false,
                  });
                }}
              >
                <span>Cancel</span>
              </button>
            </div>
          </div>
        ),
      });
    } else {
      const filters = this.state.locationFilters;
      filters[type] = value;
      this.setState({ locationFilters: filters });
      await this.fetchLocations();
    }
  };

  getLocationPostData = () => {
    let locationPostData = {
      kw: this.state.locationFilters.kw.trim(),
      region: this.state.locationFilters.region,
      state: this.state.locationFilters.state,
      city: this.state.locationFilters.city,
      applyQty: this.state.locationFilters.applyQty,
      qty: this.state.locationFilters.qty,
      limit: this.state.locationsPagination.limit,
      page: this.state.locationsPagination.page,
    };

    return locationPostData;
  };

  getQtyPostData = () => {
    const prodLocQty = this.state.prodLocQty;

    let changedQtys = {};
    _.map(prodLocQty, (locations, productId) => {
      _.map(locations, (qtys, locationId) => {
        let finalQty = null;

        if (
          this.prevProdLocQty[productId] &&
          this.prevProdLocQty[productId][locationId]
        ) {
          const pqty = this.prevProdLocQty[productId][locationId]["qty"];
          if (qtys.qty != pqty) {
            finalQty = qtys.qty;
          }
        } else {
          if (qtys.qty > 0) {
            finalQty = qtys.qty;
          }
        }
        if (finalQty != null) {
          if (changedQtys[productId]) {
            changedQtys[productId][locationId] = qtys.qty;
          } else {
            changedQtys[productId] = {
              [locationId]: qtys.qty,
            };
          }
        }
      });
    });

    return changedQtys;
  };

  getPoPostData = () => {
    const locPo = this.state.locPo;

    let changedPos = {};
    _.map(locPo, (po, locationId) => {
      let finalPo = null;

      if (this.prevLocPo[locationId]) {
        const ppo = this.prevLocPo[locationId];
        if (po != ppo) {
          finalPo = po;
        }
      } else {
        if (po != "") {
          finalPo = po;
        }
      }
      if (finalPo != null) {
        changedPos[locationId] = po;
      }
    });

    return changedPos;
  };

  updateOrder = async () => {
    const postQtyData = this.getQtyPostData();
    const postPoData = this.getPoPostData();
    let shouldLoadProdLocQty = false;
    if (!_.isEmpty(postQtyData)) {
      shouldLoadProdLocQty = true;
      this.setLoaderState({
        show: true,
        title: "Please wait",
        content: <div>Updating Quantities...</div>,
      });
      await updateQtys({ cart: postQtyData });
      this.setLoaderState({
        show: false,
      });
    }
    if (!_.isEmpty(postPoData)) {
      shouldLoadProdLocQty = true;
      this.setLoaderState({
        show: true,
        title: "Please wait",
        content: <div>Updating POs...</div>,
      });
      await updatePos({ po: postPoData });
      this.setLoaderState({
        show: false,
      });
    }

    if (shouldLoadProdLocQty) {
      this.setLoaderState({
        show: true,
        title: "Please wait",
        content: <div>Loading Cart...</div>,
      });
      await this.fetchProdLocQty();
      this.setLoaderState({
        show: false,
      });
    }
  };

  /**
   * Events
   */

  handleProductPagination = async (pageNumber) => {
    const prodsPag = this.state.productsPagination;
    prodsPag.page = pageNumber;
    this.setState({ productsPagination: prodsPag });
    await this.fetchProducts();
  };

  handleLocationPagination = async (pageNumber) => {
    const locsPag = this.state.locationsPagination;
    locsPag.page = pageNumber;
    this.setState({ locationsPagination: locsPag });
    await this.fetchLocations();
  };

  setLoaderState = (loaderData) => {
    const { loader } = this.state;
    loaderData = { ...loader, ...loaderData };
    // loaderData.show = show;
    // loaderData.title = !_.isNull(title) ? title : loaderData.title;
    // loaderData.content = !_.isNull(content) ? content : loaderData.content;

    this.setState({ loader: loaderData });
  };

  fetchProdLocQty = async () => {
    await getProdLocQty().then((data) => {
      this.setState({ prodLocQty: data.qty, locPo: data.po });
      this.prevProdLocQty = _.cloneDeep(data.qty);
      this.prevLocPo = _.cloneDeep(data.po);
    });
  };

  fetchProducts = async () => {
    this.setLoaderState({
      show: true,
      title: "Please wait",
      content: <div>Loading Products...</div>,
    });
    await getProducts(this.getProductPostData()).then((data) => {
      this.setState({ products: _.mapKeys(data.products, "entity_id") });
      this.setState({
        productsPagination: {
          limit: data.limit,
          page: data.page,
          totalPage: data.total,
        },
      });
      this.setLoaderState({
        show: false,
      });
    });
  };

  fetchLocations = async () => {
    this.setLoaderState({
      show: true,
      title: "Please wait",
      content: <div>Loading Locations...</div>,
    });
    await getLocations(this.getLocationPostData()).then((data) => {
      this.setState({ locations: _.mapKeys(data.locations, "id") });
      this.setState({
        locationsPagination: {
          limit: data.limit,
          page: data.page,
          totalPage: data.total,
        },
      });
      this.setLoaderState({
        show: false,
      });
    });
  };

  /**
   * Hooks
   */
  componentDidMount = () => {
    let promiseProdLocQty = new Promise((resolve, reject) => {
      getProdLocQty().then((data) => {
        this.setState({ prodLocQty: data.qty, locPo: data.po });
        this.setLoaderState({ content: <div>Loading Cart...</div> });
        this.prevProdLocQty = _.cloneDeep(data.qty);
        this.prevLocPo = _.cloneDeep(data.po);
        if (data) {
          resolve(data);
        }
      });
    });
    let promiseProducts = new Promise((resolve, reject) => {
      getProducts(this.getProductPostData()).then((data) => {
        this.setState({ products: _.mapKeys(data.products, "entity_id") });
        this.setLoaderState({ content: <div>Loading Products...</div> });
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
    let promiseLocations = new Promise((resolve, reject) => {
      getLocations(this.getLocationPostData()).then((data) => {
        this.setState({ locations: _.mapKeys(data.locations, "id") });
        this.setLoaderState({ content: <div>Loading Locations...</div> });
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

    this.setLoaderState({ show: true });
    Promise.all([promiseProdLocQty, promiseProducts, promiseLocations])
      .then(([prodLocQty, products, locations]) => {
        if (_.isEmpty(products.products) || _.isEmpty(locations.locations)) {
        } else {
          this.generateTotals();
        }

        this.setState({ isLoading: false });
        setTimeout(() => {
          this.setLoaderState({ show: false });
        }, 500);
      })
      .catch(function (err) {
        console.log("Error", err);
      });

    window.addEventListener("scroll", this.handleScroll);
  };

  componentWillUnmount = () => {
    window.removeEventListener("scroll", this.handleScroll);
  };

  handleScroll = (event) => {
    let scrollTop = event.srcElement.body.scrollTop,
      itemTranslate = Math.min(0, scrollTop / 3 - 60);

    if (this.refMyCartBody.current) {
      console.log(
        "getBoundingClientRect",
        this.refMyCartBody.current.getBoundingClientRect().top,
        "window.pageYOffset",
        window.pageYOffset,
        "window.innerHeight",
        window.innerHeight
      );
    }

    //   if (this.stickyFooter.current) {
    //   console.log(
    //     "getBoundingClientRect",
    //     this.stickyFooter.current.getBoundingClientRect().top,
    //     "window.pageYOffset",
    //     window.pageYOffset,
    //     "window.innerHeight",
    //     window.innerHeight
    //   );

    //   if (
    //     window.innerHeight >
    //     this.stickyFooter.current.getBoundingClientRect().top
    //   ) {
    //     this.setState({ stickFooter: true });
    //   } else {
    //     this.setState({ stickFooter: false });
    //   }
    // }

    // var self = this;
    // var addToBox = $(self.element);
    // var addToBoxBottom = addToBox[0].getBoundingClientRect().bottom + window.pageYOffset;
    // var addToBoxTop = addToBox[0].getBoundingClientRect().top + window.pageYOffset;

    // if (window.innerWidth < self.end) {
    //     if ((window.pageYOffset + window.innerHeight) > addToBoxTop) {
    //         self.flag = true;
    //     }
    //     if (self.flag) {
    //         if ((window.pageYOffset + window.innerHeight) > addToBoxTop) {
    //             if (window.pageYOffset > addToBoxBottom) {
    //                 $(self.default.add).addClass(self.default.class);
    //             } else if ((window.pageYOffset + window.innerHeight) > addToBoxTop) {
    //                 $(self.default.add).removeClass(self.default.class);
    //             }
    //         } else if (window.pageYOffset < addToBoxBottom) {
    //             $(self.default.add).addClass(self.default.class);
    //         }
    //     }
    // } else {
    //     if ($(self.default.add).hasClass(self.default.class)) {
    //         $(self.default.add).removeClass(self.default.class);
    //     }
    // }
  };

  getTestCont = () => {
    return <div>LoadinggetTestCont...</div>;
  };

  render() {
    if (this.state.isLoading)
      return (
        <div>
          <Loader loaderData={this.state.loader}></Loader>
        </div>
      );

    return (
      <div>
        <div className="multishipping_cart_wrapper">
          <div className="multishipping_cart_header">
            <ProductFilters
              filters={this.state.productFilters}
              updateFilter={this.updateProductFilter}
            />
            <LocationFilters
              locPo={this.state.locPo}
              prevLocPo={this.prevLocPo}
              locations={this.state.locations}
              changePO={this.setPO}
              filters={this.state.locationFilters}
              updateFilter={this.updateLocationFilter}
            />
            <div className="address_list_total table_grand_total_by_sku">
              <div className="total_label">Extended</div>
            </div>
          </div>

          <div className="multishipping_cart_body" ref={this.refMyCartBody}>
            <div className="address_list_product table">
              <div className="table-body" id="by_sku_product">
                {this.renderProducts()}
              </div>
              {!_.isEmpty(this.state.products) &&
                this.state.productsPagination.totalPage > 10 && (
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
                <div className="address_list_slider">
                  <div
                    className="address_list_qty_table by_sku_locations_table qty_manager table"
                    data-page="0"
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
              </div>
            </div>

            <div className="address_list_total table_grand_total_by_sku">
              <div id="table_grand_total_by_sku">
                {this.renderProductTotals()}
              </div>
            </div>
          </div>

          <div
            className={`multishipping_cart_footer ${
              this.state.stickFooter ? "sticky-bottom" : ""
            }`}
            ref={this.stickyFooter}
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
                <div className="address_list_slider">
                  <div className="address_list_qty_table by_sku_locations_table table">
                    <div className="table-body" id="location_total_by_sku">
                      <div className="row-table locations-total">
                        {this.renderLocationTotals()}
                      </div>
                    </div>
                  </div>
                </div>
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
                <span className="label">Subtotal:</span>
                <span className="value" id="subtotal_val">
                  $527.00
                </span>
              </div>

              <div className="row">
                <span className="label">Tax:</span>
                <span className="value" id="tax_val">
                  $0.00
                </span>
              </div>

              <div className="row full-total">
                <span className="label">Total:</span>
                <span className="value" id="total_val">
                  $527.00
                </span>
              </div>

              <div
                className={`row full-total action-buttons ${
                  this.state.stickFooter ? "sticky-bottom" : ""
                }`}
              >
                <button
                  className="round-but active-but update_order_but"
                  disabled={
                    _.isEmpty(this.getQtyPostData()) &&
                    _.isEmpty(this.getPoPostData())
                  }
                  onClick={this.updateOrder}
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
        <Loader loaderData={this.state.loader}></Loader>
      </div>
    );
  }
}

export default MainForm;
