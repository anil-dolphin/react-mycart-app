import React from "react";
import { getFilterFieldsData } from "../helpers/dataHelper";
import Select from "react-select";

class ProductFilters extends React.Component {
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
          console.log(selectedOption);
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
    const models = getFilterFieldsData("models");
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
      <input
        type="text"
        placeholder="Search Products"
        value={this.props.filters.kw}
        onChange={(event) => this.props.updateFilter("kw", event.target.value)}
      />
    );
  };

  render() {
    return (
      <div className="address_list_product table">
        <div className="multishipping_filters_cart" id="cart_filters">
          <div className="one_filter_cart_title">Products</div>
          <div className="one_filter_cart product_filter_header">
            <div className="category-list" style={{ paddingTop: 0 }}>
              {this.renderCategoryFilter()}
            </div>
            <div className="product-attr-list">
              <select
                onChange={(event) =>
                  this.props.updateFilter("make", event.target.value)
                }
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
                value={this.props.filters.model}
              >
                <option value="0">Model</option>
                {this.renderModelFilter()}
              </select>
            </div>
            <div className="filter_product_search_wrapper">
              {this.renderKeywordFilter()}
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
