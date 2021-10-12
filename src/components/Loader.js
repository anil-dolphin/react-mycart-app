import React from "react";
import ReactDOM from "react-dom";

class Loader extends React.Component {
  render() {
    const { loaderData } = this.props;
    return ReactDOM.createPortal(
      <div className={`loader ${loaderData.show ? "" : "hidden"}`}>
        <div className="loader-wrapper">
          <h3 className="title">{loaderData.title}</h3>
          <div className="content">{loaderData.content}</div>
          {this.props.children}
        </div>
      </div>,
      document.querySelector("#mycart_modal")
    );

    // return (
    //   <div className={`loader ${loaderData.show ? "" : "hidden"}`}>
    //     <div className="loader-wrapper">
    //       <h3 className="title">{loaderData.title}</h3>
    //       {/* <div className="content">{loaderData.content}</div> */}
    //       {this.props.children}
    //     </div>
    //   </div>
    // );
  }
}

export default Loader;
