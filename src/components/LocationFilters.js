import React from "react";
import _ from "lodash";
import LocationBlock from "./LocationBlock";
import { getFilterFieldsData } from "../helpers/dataHelper";

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
      <input
        type="text"
        placeholder="Filter by Store Name"
        value={this.props.filters.kw}
        onChange={(event) => this.props.updateFilter("kw", event.target.value)}
      />
    );
  };

  renderLocations() {
    const { locations } = this.props;

    if (_.isEmpty(locations)) {
      return <div className="no-data-found">No locations found</div>;
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
    return (
      <div className="address_list_qty">
        <div className="count_show_qty">
          <div className="show-qty-inner">
            <p>
              <b>Shipping Locations:&nbsp;</b> Showing{" "}
              <span className="now_shown">6</span> of{" "}
              <span className="total_shown">6</span> locations
              <span className="is_filtered"></span>
            </p>
          </div>
        </div>
        <div className="count_show_qty">
          <div className="location_list_qty_header" id="loc_list_qty_header">
            {this.renderKeywordFilter()}
            <select
              onChange={(event) =>
                this.props.updateFilter("region", event.target.value)
              }
              value={this.props.filters.region}
            >
              <option value="0">Region</option>
              {this.renderRegionFilter()}
            </select>
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
