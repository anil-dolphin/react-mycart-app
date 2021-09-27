import React from "react";

class LocationBlock extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.loaderRef = React.createRef();
  // }

  render() {
    const { location } = this.props;

    return (
      <div
        className="col col-31 location-name border-right"
        title="Delray Beach - Delray Marketplace"
      >
        <div className="location-info">
          <span>Delray Beach FL</span>
          <br />
          Delray Beach - Delray Marketplace
          <br />
          <span>937</span>
          <div className="more-info">
            <span className="cname">Shama Arige</span>
            <span className="phoneno">5612237640</span>
          </div>
        </div>
        <div className="location-po">
          <input
            type="text"
            name="po[207]"
            id="po-207"
            size="20"
            value=""
            data-pval=""
          />
        </div>
      </div>
    );
  }
}

export default LocationBlock;
