import React from "react";

import LocationBlock from "./LocationBlock";
import { getLocations } from "../helpers/dataHelper";

class LocationFilters extends React.Component {
  renderLocations() {
    const locations = getLocations();
    return Object.values(locations).map((location) => {
      return <LocationBlock location={location} key={location.id} />;
    });
  }

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
            <input
              type="text"
              placeholder="Filter by Store Name"
              id="store_search"
            />

            <select id="filter_by_store_region" aria-hidden="true">
              <option value="0">Region</option>
              <option value="FLD3">FLD3</option>
              <option value="Marcus Kinnaird">Marcus Kinnaird</option>
              <option value="NFL">NFL</option>
            </select>
            <select id="filter_by_store_state" aria-hidden="true">
              <option value="0">State</option>
              <option value="42">CO</option>
              <option value="57">FL</option>
              <option value="60">GA</option>
              <option value="69">ID</option>
              <option value="72">IL</option>
              <option value="99">MA</option>
              <option value="114">MT</option>
              <option value="126">NJ</option>
              <option value="129">NM</option>
              <option value="120">NV</option>
              <option value="144">OH</option>
              <option value="156">PA</option>
              <option value="165">SC</option>
              <option value="174">TX</option>
              <option value="189">WA</option>
            </select>
            <select id="filter_by_store_city" aria-hidden="true">
              <option value="0">City</option>
              <option value="Bluffton">Bluffton</option>
              <option value="Boiling Spgs">Boiling Spgs</option>
              <option value="Camden">Camden</option>
              <option value="Clemson">Clemson</option>
              <option value="Delray Beach">Delray Beach</option>
              <option value="Delta">Delta</option>
              <option value="Deming">Deming</option>
              <option value="Dillon">Dillon</option>
              <option value="Douglasville">Douglasville</option>
              <option value="Driggs">Driggs</option>
              <option value="Dublin">Dublin</option>
              <option value="E Brunswick">E Brunswick</option>
              <option value="Eagle">Eagle</option>
              <option value="Eatonton">Eatonton</option>
              <option value="Edgartown">Edgartown</option>
              <option value="El Paso">El Paso</option>
              <option value="Elgin">Elgin</option>
              <option value="Elko">Elko</option>
              <option value="Elverson">Elverson</option>
              <option value="Emmett">Emmett</option>
              <option value="Enumclaw">Enumclaw</option>
              <option value="Gulf Breeze">Gulf Breeze</option>
              <option value="Hartsville">Hartsville</option>
              <option value="Jacksonville">Jacksonville</option>
              <option value="Jupiter">Jupiter</option>
              <option value="Lake Mary">Lake Mary</option>
              <option value="Lake Wales">Lake Wales</option>
              <option value="Lakeland">Lakeland</option>
              <option value="Largo">Largo</option>
              <option value="Leesburg">Leesburg</option>
              <option value="Lehigh Acres">Lehigh Acres</option>
              <option value="Marianna">Marianna</option>
              <option value="Miami">Miami</option>
              <option value="Miami Beach">Miami Beach</option>
              <option value="Milton">Milton</option>
              <option value="N Charleston">N Charleston</option>
              <option value="Naples">Naples</option>
              <option value="Navarre">Navarre</option>
              <option value="Neptune Beach">Neptune Beach</option>
              <option value="New Prt Rchy">New Prt Rchy</option>
              <option value="New Smyrna">New Smyrna</option>
              <option value="Newberry">Newberry</option>
              <option value="Niceville">Niceville</option>
              <option value="North Port">North Port</option>
              <option value="Ocala">Ocala</option>
              <option value="Orange Park">Orange Park</option>
              <option value="Orlando">Orlando</option>
              <option value="Ormond Beach">Ormond Beach</option>
              <option value="P C Beach">P C Beach</option>
              <option value="St Augustine">St Augustine</option>
              <option value="Tallahassee">Tallahassee</option>
              <option value="Winter Spgs">Winter Spgs</option>
            </select>
            <div className="one_filter_cart location_qty_filter_header">
              {/* <div className="filter_location_qty_search_wrapper">
            <label for="filter_by_location_qty">
              <input
                type="checkbox"
                name="filter_by_location_qty"
                id="filter_by_location_qty"
              />{" "}
              Only show stores with quantity:{" "}
            </label>
          </div> */}
              <div className="filter_location_qty_value_search_wrapper">
                <select
                  id="filter_by_location_qty_value"
                  aria-hidden="true"
                  disabled=""
                >
                  <option value="gtz">Qty &gt; 0</option>
                  <option value="eqz">Qty = 0</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div
          className="location_list_qty_table_wrapper"
          data-no-text="No stores found"
        >
          <div className="arrows prev disabled"></div>
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
          <div className="arrows next disabled"></div>
        </div>
      </div>
    );
  }
}

export default LocationFilters;
