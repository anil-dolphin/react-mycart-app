import React from "react";
import ProductFilters from "./ProductFilters";
import LocationFilters from "./LocationFilters";
import ProductBlock from "./ProductBlock";
import CartSummary from "./CartSummary";
import ImportExport from "./ImportExport";
import Loader from "./Loader";

import _ from "lodash";

import {
  getProducts,
  getLocations,
  getProdLocQty,
  getCartSummary,
  downloadCart,
  updateQtys,
  updatePos,
  updateCartSection,
  getUrl,
} from "../helpers/dataHelper";
import { toCurrency, toQty } from "../helpers/utilityHelper";

class MainForm extends React.Component {
  constructor(props) {
    super(props);
    this.autoSaveInterval = 0;
    this.prevProdLocQty = {};
    this.prevLocPo = {};
    this.quoteProdPrice = {};

    this.refMyCartWrapper = React.createRef();
    this.refMyCartBody = React.createRef();
    this.refMyCartHeader = React.createRef();
    this.refMyCartFooter = React.createRef();
  }

  state = {
    isLoading: true,
    prodLocQty: {},
    locPo: {},
    cartSummary: {},
    total: { products: [], locations: [], grand: 0 },
    locations: {},
    products: {},
    productsPagination: { limit: 25, page: 1, totalPage: 0 },
    locationsPagination: { limit: 6, page: 1, totalPage: 0 },
    productFilters: {
      kw: "",
      categories: [],
      make: 0,
      model: 0,
      brand: 0,
      applyQty: false,
      qty: "gtz",
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
    headerTop: 0,
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
      qty = prodLocQty[productId][locationId];
    }
    cssClass = qty > 0 ? "has-qty" : "";

    if (
      this.prevProdLocQty[productId] &&
      this.prevProdLocQty[productId][locationId]
    ) {
      pqty = this.prevProdLocQty[productId][locationId];
      cssClass = qty != pqty ? cssClass + " qty-changed" : cssClass;
    } else {
      cssClass = qty > 0 ? "has-qty qty-changed" : "";
    }

    return (
      <input
        type="number"
        size="4"
        min={0}
        className={cssClass}
        value={qty}
        data-role="cart-item-qty"
        onChange={(event) => {
          this.setQty(
            productId,
            locationId,
            event.target.value == "" || isNaN(event.target.value)
              ? 0
              : toQty(event.target.value)
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
  getProduct = (productId) => {
    const products = _.mapKeys(this.state.products, "entity_id");
    return products[productId];
  };

  // getLocation = (locationId) => {
  //   const locations = _.mapKeys(this.state.locations, "id");
  //   return locations[locationId];
  // };

  generateTotals = () => {
    const { prodLocQty } = this.state;
    var grandTotal = 0,
      pTotals = [],
      lTotals = [];

    Object.keys(prodLocQty).map((productId) => {
      let price = 0;
      const product = this.getProduct(productId);
      if (product === undefined) price = this.quoteProdPrice[productId];
      else price = product.price;

      Object.keys(prodLocQty[productId]).map((locationId) => {
        const qty = toQty(prodLocQty[productId][locationId]);
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
    const productsTotal = this.state.total.products;
    const prodLocQty = this.state.prodLocQty;
    const product = this.getProduct(productId);
    let qtyAdded = 0;
    if (productsTotal[productId] !== undefined) {
      qtyAdded = productsTotal[productId].qty;
    }

    let cellQty =
      prodLocQty[productId] && prodLocQty[productId][locationId]
        ? prodLocQty[productId][locationId]
        : 0;
    const productsTotalWoCell = qtyAdded - cellQty;
    const productsTotalTobe = productsTotalWoCell + qty;
    let qtyToSet = qty;
    const maxAllowedQty = Math.min(product.qty, product.max_sale_qty);

    if (productsTotalTobe > maxAllowedQty) {
      qtyToSet = maxAllowedQty - productsTotalWoCell;
    }

    return toQty(qtyToSet);
  };

  setQty = (productId, locationId, qty) => {
    const qtyToSet = this.getQtyWithCap(productId, locationId, qty);
    const prodLocQty = this.state.prodLocQty;

    if (!prodLocQty[productId]) {
      prodLocQty[productId] = {
        [locationId]: qtyToSet,
      };
    } else {
      prodLocQty[productId][locationId] = qtyToSet;
    }

    this.setState({ prodLocQty: prodLocQty }, () => this.generateTotals());
    this.setAutoSave();
  };

  setQtyMultiple = (data) => {
    const { locations } = this.state;
    const currentProdLocQty = this.state.prodLocQty;
    const qtyToSet = data.qty;
    const product = this.getProduct(data.productId);
    const maxAllowedQty = Math.min(product.qty, product.max_sale_qty);

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
      currentProdLocQty[data.productId][location.id] = qty;
    });

    this.setState({ prodLocQty: currentProdLocQty }, () => {
      this.generateTotals();
    });
    this.setAutoSave();
  };

  removeQtyMultiple = (productId) => {
    const currentProdLocQty = this.state.prodLocQty;
    // delete currentProdLocQty[productId];

    _.map(currentProdLocQty[productId], (qty, locationId) => {
      currentProdLocQty[productId][locationId] = 0;
    });
    this.setState({ prodLocQty: currentProdLocQty }, () => {
      this.generateTotals();
    });
    this.setAutoSave();
  };

  setPO = (locationId, po) => {
    const locPo = this.state.locPo;
    locPo[locationId] = po;
    if (this.prevLocPo[locationId] === undefined && po == "")
      delete locPo[locationId];

    this.setState({ locPo: locPo });
    this.setAutoSave();
  };

  isUpdatePending = () => {
    return !(
      _.isEmpty(this.getQtyPostData()) && _.isEmpty(this.getPoPostData())
    );
  };

  openPendingSavePopup = (callback) => {
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
              className="round-but active-but"
              type="button"
              onClick={async () => {
                await this.updateOrder();
                this.setLoaderState({
                  show: false,
                });
                await callback();
              }}
            >
              <span>Update and Proceed</span>
            </button>
            <button
              className="round-but"
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
  };

  updateProductFilter = async (type, value) => {
    if (this.isUpdatePending()) {
      await this.openPendingSavePopup(() =>
        this.updateProductFilter(type, value)
      );
    } else {
      this.updateProductFilterValue(type, value);
      await this.clearProductPagination();
      await this.fetchProducts();
    }
  };

  updateProductFilterValue = (type, value) => {
    const filters = this.state.productFilters;
    filters[type] = value;
    this.setState({ productFilters: filters });
  };

  clearProductFilter = async () => {
    if (this.isUpdatePending()) {
      await this.openPendingSavePopup(() => this.clearProductFilter());
    } else {
      let filters = this.state.productFilters;
      filters = {
        kw: "",
        categories: [],
        make: 0,
        model: 0,
        brand: 0,
        applyQty: false,
        qty: "gtz",
      };

      this.clearProductPagination();
      this.setState({ productFilters: filters }, this.fetchProducts);
    }
  };

  clearProductPagination = async () => {
    let pagination = this.state.productsPagination;
    pagination = { limit: 25, page: 1, totalPage: 0 };
    await this.setState({ productsPagination: pagination });
  };

  searchProductFilter = async () => {
    if (this.isUpdatePending()) {
      await this.openPendingSavePopup(() => this.searchProductFilter());
    } else {
      await this.clearProductPagination();
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
      applyQty: this.state.productFilters.applyQty,
      qty: this.state.productFilters.qty,
      limit: this.state.productsPagination.limit,
      page: this.state.productsPagination.page,
    };

    return productPostData;
  };

  updateLocationFilter = async (type, value) => {
    if (this.isUpdatePending()) {
      await this.openPendingSavePopup(() =>
        this.updateLocationFilter(type, value)
      );
    } else {
      this.updateLocationFilterValue(type, value);
      await this.clearLocationPagination();
      await this.fetchLocations();
    }
  };

  updateLocationFilterValue = (type, value) => {
    const filters = this.state.locationFilters;
    filters[type] = value;
    this.setState({ locationFilters: filters });
  };

  clearLocationFilter = async () => {
    if (this.isUpdatePending()) {
      await this.openPendingSavePopup(() => this.clearLocationFilter());
    } else {
      let filters = this.state.locationFilters;
      filters = {
        kw: "",
        region: "",
        state: 0,
        city: "",
        applyQty: false,
        qty: "gtz",
      };

      this.clearLocationPagination();
      this.setState({ locationFilters: filters }, this.fetchLocations);
    }
  };

  clearLocationPagination = async () => {
    let pagination = this.state.locationsPagination;
    pagination = { limit: 6, page: 1, totalPage: 0 };
    await this.setState({ locationsPagination: pagination });
  };

  searchLocationFilter = async () => {
    if (this.isUpdatePending()) {
      await this.openPendingSavePopup(() => this.searchLocationFilter());
    } else {
      await this.clearLocationPagination();
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
      _.map(locations, (qty, locationId) => {
        let finalQty = null;

        if (
          this.prevProdLocQty[productId] &&
          this.prevProdLocQty[productId][locationId]
        ) {
          const pqty = this.prevProdLocQty[productId][locationId];
          if (qty != pqty) {
            finalQty = qty;
          }
        } else {
          if (qty > 0) {
            finalQty = qty;
          }
        }
        if (finalQty != null) {
          if (changedQtys[productId]) {
            changedQtys[productId][locationId] = qty;
          } else {
            changedQtys[productId] = {
              [locationId]: qty,
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

      if (this.state.productFilters.applyQty) await this.fetchProducts();
      if (this.state.locationFilters.applyQty) await this.fetchLocations();
      await this.fetchProdLocQty();
      await this.fetchCartSummary();
      this.generateTotals();
      updateCartSection();
      this.setLoaderState({
        show: false,
      });
    }
  };

  goToCheckout = async () => {
    if (this.isUpdatePending()) {
      await this.openPendingSavePopup(
        () => (window.location.href = getUrl("selectShipping"))
      );
    } else {
      window.location.href = getUrl("selectShipping");
    }
  };

  setAutoSave = () => {
    clearInterval(this.autoSaveInterval);
    this.autoSaveInterval = setInterval(() => {
      this.updateOrder();
    }, 10000);
  };

  downloadCurrentCart = () => {
    downloadCart({ qty: this.state.prodLocQty, po: this.state.locPo });
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
    this.setState({ loader: loaderData });
  };

  fetchProdLocQty = async () => {
    await getProdLocQty().then((data) => {
      this.quoteProdPrice = data.price;
      this.setState({ prodLocQty: data.qty, locPo: data.po });
      this.prevProdLocQty = _.cloneDeep(data.qty);
      this.prevLocPo = _.cloneDeep(data.po);
    });
  };

  fetchCartSummary = async () => {
    await getCartSummary().then((data) => {
      this.setState({ cartSummary: data });
    });
  };

  fetchProducts = async () => {
    this.setLoaderState({
      show: true,
      title: "Please wait",
      content: <div>Loading Products...</div>,
    });
    await getProducts(this.getProductPostData()).then((data) => {
      this.setState({ products: data.products });
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
      content: <div>Loading Stores...</div>,
    });
    await getLocations(this.getLocationPostData()).then((data) => {
      this.setState({ locations: data.locations });
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
        this.quoteProdPrice = data.price;
        this.setState({ prodLocQty: data.qty, locPo: data.po });
        this.setLoaderState({ content: <div>Loading Quote...</div> });
        this.prevProdLocQty = _.cloneDeep(data.qty);
        this.prevLocPo = _.cloneDeep(data.po);
        if (data) {
          resolve(data);
        }
      });
    });
    let promiseProducts = new Promise((resolve, reject) => {
      getProducts(this.getProductPostData()).then((data) => {
        this.setState({
          products: data.products,
        });
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
        this.setState({ locations: data.locations });
        this.setLoaderState({ content: <div>Loading Stores...</div> });
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

    let promiseCartSummary = new Promise((resolve, reject) => {
      getCartSummary().then((data) => {
        this.setState({ cartSummary: data });
        this.setLoaderState({ content: <div>Loading Cart Summary...</div> });
        if (data) {
          resolve(data);
        }
      });
    });

    this.setLoaderState({ show: true });
    Promise.all([
      promiseProdLocQty,
      promiseProducts,
      promiseLocations,
      promiseCartSummary,
    ])
      .then(([prodLocQty, products, locations, cartSummary]) => {
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
    window.addEventListener("resize", this.handleResize);
  };

  // componentDidUpdate = (p, n) => {
  //   localStorage.setItem("products", JSON.stringify(n.productFilters));
  //   localStorage.setItem("locations", JSON.stringify(n.locationFilters));
  // };

  componentWillUnmount = () => {
    window.removeEventListener("scroll", this.handleScroll);
    window.removeEventListener("resize", this.handleResize);
  };

  handleStickyHeaderFooter = () => {
    if (this.refMyCartHeader.current) {
      // Sticky header
      if (this.refMyCartWrapper.current.getBoundingClientRect().top < 0) {
        if (this.refMyCartBody.current.getBoundingClientRect().bottom >= 245) {
          this.setState({
            stickHeader: true,
            headerTop:
              window.pageYOffset -
              (this.refMyCartWrapper.current.getBoundingClientRect().top +
                window.pageYOffset),
          });
        } else {
          this.setState({
            stickHeader: true,
          });
        }
      } else {
        this.setState({ stickHeader: false, headerTop: 0 });
      }
      // Sticky footer
      if (
        this.refMyCartWrapper.current.getBoundingClientRect().bottom -
          window.innerHeight >
        0
      ) {
        this.setState({
          stickFooter: true,
        });
      } else {
        this.setState({ stickFooter: false });
      }
    }
  };

  handleScroll = () => {
    this.handleStickyHeaderFooter();
  };
  handleResize = () => {
    this.handleStickyHeaderFooter();
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
        <div className="multishipping_cart_wrapper" ref={this.refMyCartWrapper}>
          <div
            ref={this.refMyCartHeader}
            className={`multishipping_cart_header ${
              this.state.stickHeader ? "sticky-header" : ""
            }`}
            style={{ top: `${this.state.headerTop}px` }}
          >
            <ProductFilters
              filters={this.state.productFilters}
              updateFilter={this.updateProductFilter}
              updateFilterValue={this.updateProductFilterValue}
              clearFilters={this.clearProductFilter}
              search={this.searchProductFilter}
              pagination={this.state.productsPagination}
              onPaginate={this.handleProductPagination}
            />
            <LocationFilters
              locPo={this.state.locPo}
              prevLocPo={this.prevLocPo}
              locations={this.state.locations}
              changePO={this.setPO}
              pagination={this.state.locationsPagination}
              onPaginate={this.handleLocationPagination}
              filters={this.state.locationFilters}
              updateFilter={this.updateLocationFilter}
              updateFilterValue={this.updateLocationFilterValue}
              clearFilters={this.clearLocationFilter}
              search={this.searchLocationFilter}
            />
            <div className="address_list_total table_grand_total_by_sku">
              <div className="label-with-clear">
                <a
                  href={getUrl("clearCart")}
                  className="theme-color-btn btn-clear-cart"
                >
                  Clear Cart
                </a>
                <div className="total_label">Extended</div>
              </div>
            </div>
          </div>

          <div className="multishipping_cart_body" ref={this.refMyCartBody}>
            <div className="address_list_product table">
              <div className="table-body" id="by_sku_product">
                {this.renderProducts()}
              </div>
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
            ref={this.refMyCartFooter}
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
          <ImportExport downloadCart={this.downloadCurrentCart} />
          <div className="total_block">
            <CartSummary
              summary={this.state.cartSummary}
              allowUpdate={this.isUpdatePending()}
              updateOrder={this.updateOrder}
              goToCheckout={this.goToCheckout}
              stickFooter={this.state.stickFooter}
            />
          </div>
        </div>
        <Loader loaderData={this.state.loader}></Loader>
      </div>
    );
  }
}

export default MainForm;
