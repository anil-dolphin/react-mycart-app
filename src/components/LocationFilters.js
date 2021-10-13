import React from "react";
import _ from "lodash";
import LocationBlock from "./LocationBlock";
import { getFilterFieldsData, getUrl } from "../helpers/dataHelper";
import Pagination from "react-js-pagination";

class LocationFilters extends React.Component {
  renderRegionFilter = () => {
    const regions = getFilterFieldsData("regions");
    return regions.map((region) => (
      <option key={`rg${region.label}`} value={region.label}>
        {region.label}
      </option>
    ));
  };

  renderStateFilter = () => {
    const states = getFilterFieldsData("states");
    return states.map((state) => (
      <option key={`st${state.id}`} value={state.id}>
        {state.label}
      </option>
    ));
  };

  renderCityFilter = () => {
    const cities = getFilterFieldsData("cities");
    return cities.map((city) => (
      <option key={`ct${city.label}`} value={city.label}>
        {city.label}
      </option>
    ));
  };

  renderQtyFilter = () => {
    const qtys = [
      { value: "gtz", label: "Qty > 0" },
      { value: "eqz", label: "Qty = 0" },
    ];
    return qtys.map((qty) => (
      <option key={`qt${qty.value}`} value={qty.value}>
        {qty.label}
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
          placeholder="Filter by Store Name"
          value={this.props.filters.kw}
          onChange={(event) =>
            this.props.updateFilterValue("kw", event.target.value)
          }
        />
      </form>
    );
  };

  renderLocations() {
    const { locations } = this.props;

    if (_.isEmpty(locations)) {
      return (
        <div className="no-data-found">
          No stores found.{" "}
          <a
            href={getUrl("manageLocations")}
            className="theme-color-btn"
            target="_blank"
          >
            Manage Stores
          </a>
        </div>
      );
    } else {
      return Object.values(this.props.locations).map((location) => {
        const po = this.getLocationPo(location.id);
        const { prevLocPo } = this.props;
        let ppo = null,
          cssClass = "";

        cssClass = po != "" ? "has-po" : "";
        if (prevLocPo[location.id]) {
          ppo = prevLocPo[location.id];
          cssClass = po != ppo ? cssClass + " po-changed" : cssClass;
        } else {
          cssClass = po != "" ? "has-po po-changed" : "";
        }

        return (
          <LocationBlock
            po={po}
            cssClass={cssClass}
            changePO={this.props.changePO}
            location={location}
            key={location.id}
          />
        );
      });
    }
  }

  getLocationPo = (locationId) => {
    return this.props.locPo[locationId] ? this.props.locPo[locationId] : "";
  };

  render() {
    const { limit, page, totalPage } = this.props.pagination;

    let locationsCount = limit;
    let isLastPage = false;
    if (limit * page >= totalPage) {
      locationsCount = totalPage - limit * (page - 1);
      isLastPage = true;
    }

    let fromTo = { from: page, to: limit };
    if (page == 1) {
      fromTo = { from: page, to: limit };
      if (isLastPage) {
        fromTo = { from: page, to: locationsCount };
      }
    } else if (page > 1 && !isLastPage) {
      fromTo = { from: limit * (page - 1) + 1, to: page * limit };
    } else if (isLastPage) {
      fromTo = { from: limit * (page - 1) + 1, to: totalPage };
    }
    return (
      <div className="address_list_qty">
        <div className="count_show_qty">
          <div className="show-qty-inner">
            <p>
              <b>Shipping Addresses (Stores):&nbsp;</b> Showing{" "}
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
              stores
              <span className="is_filtered"></span>
            </p>
          </div>

          <div className="location-pagination">
            {this.props.pagination.totalPage > 6 && (
              <Pagination
                activePage={this.props.pagination.page}
                itemsCountPerPage={this.props.pagination.limit}
                totalItemsCount={this.props.pagination.totalPage}
                pageRangeDisplayed={1}
                onChange={this.props.handlePagination}
                linkClassFirst="first arrow"
                linkClassPrev="prev arrow"
                linkClassNext="next arrow"
                linkClassLast="last arrow"
                prevPageText={
                  <button type="button">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="arrows-icon"
                      width="25"
                      height="25"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 19l-7-7 7-7"
                      ></path>
                    </svg>
                  </button>
                }
                nextPageText={
                  <button type="button">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="arrows-icon"
                      width="25"
                      height="25"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      ></path>
                    </svg>
                  </button>
                }
                firstPageText={null}
                lastPageText={null}
              />
            )}
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
        <div className="count_show_qty">
          <div className="location_list_qty_header" id="loc_list_qty_header">
            {this.renderKeywordFilter()}
            {getFilterFieldsData("regions") ? (
              <select
                onChange={(event) =>
                  this.props.updateFilter("region", event.target.value)
                }
                value={this.props.filters.region}
              >
                <option value="0">Region</option>
                {this.renderRegionFilter()}
              </select>
            ) : (
              ""
            )}
            <select
              onChange={(event) =>
                this.props.updateFilter("state", event.target.value)
              }
              value={this.props.filters.state}
            >
              <option value="0">State</option>
              {this.renderStateFilter()}
            </select>
            <select
              onChange={(event) =>
                this.props.updateFilter("city", event.target.value)
              }
              value={this.props.filters.city}
            >
              <option value="0">City</option>
              {this.renderCityFilter()}
            </select>

            <div className="one_filter_cart location_qty_filter_header">
              <div className="filter_location_qty_search_wrapper">
                <label htmlFor="filter_by_location_qty">
                  <input
                    type="checkbox"
                    id="filter_by_location_qty"
                    name="filter_by_location_qty"
                    checked={this.props.filters.applyQty}
                    onChange={(event) =>
                      this.props.updateFilter("applyQty", event.target.checked)
                    }
                  />
                  Only show stores with quantity:{" "}
                </label>
              </div>
              <div className="filter_location_qty_value_search_wrapper">
                <select
                  disabled={!this.props.filters.applyQty}
                  onChange={(event) =>
                    this.props.updateFilter("qty", event.target.value)
                  }
                  value={this.props.filters.qty}
                >
                  {this.renderQtyFilter()}
                </select>
              </div>
            </div>
          </div>
        </div>
        <div
          className="location_list_qty_table_wrapper"
          data-no-text="No stores found"
        >
          <div className="address_list_slider">
            <div
              className="address_list_qty_table by_sku_locations_table table"
              data-page="0"
            >
              <div className="table-header">
                <div className="row-table" id="location_name_by_sku">
                  {this.renderLocations()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LocationFilters;
