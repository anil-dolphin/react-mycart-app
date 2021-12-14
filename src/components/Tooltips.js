import React from "react";
import { getFilterFieldsData } from "../helpers/dataHelper";
import ReactTooltip from "react-tooltip";

class Tooltips extends React.Component {
  constructor(props) {
    super(props);
    // this.tooltip = 0;
    this.tooltip = React.createRef();
  }

  componentDidMount() {
    // setTimeout(() => {
    //   ReactTooltip.rebuild();
    //   console.log("rebuilt");
    // }, 5000);
  }
  startTooltip = () => {
    console.log("Start Tooltip");
    // ReactTooltip.rebuild();
    // ReactTooltip.show(this.tooltip);
    // this.tooltip.click();
    // this.tooltip.tooltipRef = "tt_prod_filters";
    // .show();

    var link = document.getElementById("el_tt_prod_filters");
    link.click();
  };

  showTooltip = (elementId) => {
    // console.log("Start Tooltip");
    // ReactTooltip.rebuild();
    // ReactTooltip.show(this.tooltip);
    // this.tooltip.click();
    // this.tooltip.tooltipRef = "tt_prod_filters";
    // .show();
    var el = document.getElementById(elementId);
    if (el) el.click();
  };

  render() {
    return (
      <React.Fragment>
        <button
          style={{ position: "fixed", top: "0", left: "0", zIndex: 10 }}
          onClick={() => {
            // console.log("Start Tooltip");
            // ReactTooltip.show("tt_prod_filters");
            // this.tooltip.tooltipRef.show();
            // ReactTooltip.show();
            this.showTooltip("ele_tt_prod_filters");
          }}
        >
          Start Tooltip
        </button>
        <ReactTooltip
          id="tt_prod_filters"
          place="top"
          effect="solid"
          clickable={true}
          scrollHide={false}
          resizeHide={false}
          className="help-tooltip"
          multiline={true}
          // html={true}
          border={false}
          isCapture={false}
          event="click"
          offset={{ top: 10 }}
          ref={(el) => (this.tooltip = el)}
        >
          <div>
            <p>
              Sample Tooltip text Sample Tooltip text Sample Tooltip text Sample
              Tooltip text Sample Tooltip text Sample Tooltip text Sample
              Tooltip text
            </p>
            <div className="tooltip-actions">
              <button className="black-white-btn">next</button>
              <button
                className="black-white-btn"
                onClick={() => {
                  this.tooltip.tooltipRef = null;
                  ReactTooltip.hide();
                  // ReactTooltip.rebuild();
                }}
              >
                close
              </button>
            </div>
          </div>
        </ReactTooltip>
      </React.Fragment>
    );
  }
}

export default Tooltips;
