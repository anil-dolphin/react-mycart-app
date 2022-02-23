import React from "react";

class LocationBlock extends React.Component {
  render() {
    const { location } = this.props;

    return (
      <div
        className="col col-31 location-name border-right"
        title={location.custom_attributes.location_name.value}
      >
        <div className="location-info">
          <span>
            {location.city} {location.region.region_code}
          </span>
          <br />
          {location.custom_attributes.location_name.value}
          <br />
          <span>{location.custom_attributes.location_store_id.value}</span>
          <div className="more-info">
            <span className="cname">
              {location.firstname} {location.lastname}
            </span>
            <span className="phoneno">{location.telephone}</span>
          </div>
        </div>
        <div className="location-po">
          <input
            type="text"
            size="20"
            placeholder="Purchase Order #"
            className={this.props.cssClass}
            value={this.props.po}
            onChange={(event) => {
              let po = event.target.value.trim().replace(/[^0-9a-z]/gi, "");
              this.props.changePO(location.id, po);
            }}
          />
        </div>
      </div>
    );
  }
}

export default LocationBlock;
