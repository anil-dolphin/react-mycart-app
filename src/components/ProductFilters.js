import React from "react";
import { getFilterFieldsData } from "../helpers/dataHelper";
import Select from "react-select";
import Pagination from "react-js-pagination";
import _ from "lodash";

class ProductFilters extends React.Component {
  getFilteredModels = () => {
    const makeId = this.props.filters.make;
    let allowedModels = [];
    if (makeId && makeId != 0) {
      let models = getFilterFieldsData("models");
      let makeModelRel = getFilterFieldsData("makeModelRel");
      let mappedModels = _.mapKeys(models, "id");
      let allowedModelIds = [];

      if (makeModelRel[makeId] !== undefined) {
        allowedModelIds = makeModelRel[makeId];
      }
      if (!_.isEmpty(allowedModelIds)) {
        allowedModelIds.map((allowedModelId) => {
          if (mappedModels[allowedModelId] !== undefined) {
            allowedModels.push(mappedModels[allowedModelId]);
          }
        });
      }
    }
    return allowedModels;
  };

  renderCategoryFilter = () => {
    const categories = getFilterFieldsData("categories");
    return (
      <Select
        isMulti
        placeholder="Categories"
        className="basic-multi-select"
        options={categories}
        isClearable={true}
        getOptionValue={(option) => option.id}
        value={this.props.filters.categories}
        onChange={(selectedOption) => {
          this.props.updateFilter("categories", selectedOption);
        }}
      />
    );
  };

  renderMakeFilter = () => {
    const makes = getFilterFieldsData("makes");
    return makes.map((make) => (
      <option key={`mk${make.id}`} value={make.id}>
        {make.label}
      </option>
    ));
  };

  renderModelFilter = () => {
    const models = this.getFilteredModels();
    return models.map((model) => (
      <option key={`md${model.id}`} value={model.id}>
        {model.label}
      </option>
    ));
  };

  renderBrandFilter = () => {
    const brands = getFilterFieldsData("brands");
    return brands.map((brand) => (
      <option key={`br${brand.id}`} value={brand.id}>
        {brand.label}
      </option>
    ));
  };

  renderKeywordFilter = () => {
    return (
      <form
        onSubmit={(event) => {
          event.preventDefault();
          this.props.updateFilter("kw", this.props.filters.kw);
        }}
      >
        <input
          type="text"
          placeholder="Search Products"
          value={this.props.filters.kw}
          onChange={(event) => {
            this.props.updateFilterValue("kw", event.target.value);
          }}
        />
      </form>
    );
  };

  render() {
    const { limit, page, totalPage } = this.props.pagination;
    // {limit: 10, page: 1, totalPage: 193}
    // {limit: 10, page: 20, totalPage: 193}
    // {limit: 10, page: 2, totalPage: 193}
    // {limit: 25, page: 7, totalPage: 193}
    // {limit: 25, page: 8, totalPage: 193}
    // {limit: 200, page: 1, totalPage: 193}

    let productsCount = limit;
    let isLastPage = false;
    if (limit * page >= totalPage) {
      productsCount = totalPage - limit * (page - 1);
      isLastPage = true;
    }

    let fromTo = { from: page, to: limit };
    if (page == 1) {
      fromTo = { from: page, to: limit };
      if (isLastPage) {
        fromTo = { from: page, to: productsCount };
      }
    } else if (page > 1 && !isLastPage) {
      fromTo = { from: limit * (page - 1) + 1, to: page * limit };
    } else if (isLastPage) {
      fromTo = { from: limit * (page - 1) + 1, to: totalPage };
    }

    return (
      <div className="address_list_product table">
        <div className="multishipping_filters_cart" id="cart_filters">
          <div className="count_show_qty">
            <div className="show-qty-inner">
              <p>
                <b>Products:&nbsp;</b> Showing{" "}
                {this.props.pagination.totalPage > 0 ? (
                  <React.Fragment>
                    <span className="now_shown">{fromTo.from}</span> to{" "}
                    <span className="now_shown">{fromTo.to}</span> of{" "}
                  </React.Fragment>
                ) : (
                  ""
                )}
                <span className="total_shown">
                  {this.props.pagination.totalPage}
                </span>{" "}
                products
                <span className="is_filtered"></span>
              </p>
            </div>
          </div>
          <div className="one_filter_cart product_filter_header">
            <div className="category-list" style={{ paddingTop: 0 }}>
              {this.renderCategoryFilter()}
            </div>
            <div className="product-attr-list">
              <select
                onChange={(event) => {
                  this.props.updateFilterValue("model", 0);
                  this.props.updateFilter("make", event.target.value);
                }}
                value={this.props.filters.make}
              >
                <option value="0">Make</option>
                {this.renderMakeFilter()}
              </select>
            </div>
            <div className="product-attr-list">
              <select
                onChange={(event) =>
                  this.props.updateFilter("model", event.target.value)
                }
                disabled={
                  !(this.props.filters.make && this.props.filters.make != 0)
                }
                value={this.props.filters.model}
              >
                <option value="0">Model</option>
                {this.renderModelFilter()}
              </select>
            </div>
            <div className="product-attr-list">
              <select
                onChange={(event) =>
                  this.props.updateFilter("brand", event.target.value)
                }
                value={this.props.filters.brand}
              >
                <option value="0">Brand</option>
                {this.renderBrandFilter()}
              </select>
            </div>
            <div className="filter_product_search_wrapper">
              {this.renderKeywordFilter()}
            </div>
            <div className="product_list_clear_filter">
              <button className="theme-color-btn" onClick={this.props.search}>
                Search
              </button>
              <button
                className="theme-color-btn"
                onClick={this.props.clearFilters}
              >
                Clear Filters
              </button>
            </div>
          </div>

          <div className="one_filter_cart location_qty_filter_header">
            {this.props.pagination.totalPage > 10 && (
              <div className="pagination">
                <Pagination
                  activePage={this.props.pagination.page}
                  itemsCountPerPage={this.props.pagination.limit}
                  totalItemsCount={this.props.pagination.totalPage}
                  pageRangeDisplayed={5}
                  hideDisabled={true}
                  onChange={this.props.onPaginate}
                  linkClassFirst="first arrow"
                  linkClassPrev="prev arrow"
                  linkClassNext="next arrow"
                  linkClassLast="last arrow"
                />
              </div>
            )}
          </div>
        </div>

        <div className="table-header">
          <div className="row-table">
            <div className="col col-9">Product Descripton</div>
            <div className="col col-4"></div>
            <div className="col col-3 align-right">Price</div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProductFilters;
