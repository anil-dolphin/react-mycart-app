import React from "react";

class LocationBlock extends React.Component {
  render() {
    const { location } = this.props;

    return (
      <div
        className="col col-31 location-name border-right"
        title="Delray Beach - Delray Marketplace"
      >
        <div className="location-info">
          <span>
            {location.city} {location.region.region_code}
          </span>
          <br />
          {location.city} - {location.street[0]}
          <br />
          <span>{location.id}</span>
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
            placeholder="PO#"
            className={this.props.cssClass}
            value={this.props.po}
            onChange={(event) => {
              this.props.changePO(location.id, event.target.value.trim());
            }}
          />
        </div>
      </div>
    );
  }
}

export default LocationBlock;
