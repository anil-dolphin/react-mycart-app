import React from "react";
import { getUrl } from "../helpers/dataHelper";

class ImportExport extends React.Component {
  render() {
    return (
      <div className="exel-part">
        <h3>Prefer Excel?</h3>
        <p>
          Download your current cart as a spreadsheet, update the quantities and
          we will create a shopping cart for you.
        </p>

        <div className="import-execel-wrapper">
          <label htmlFor="import_excel" className="round-but black-but">
            Import Order Data
          </label>
          <label htmlFor="import_excel_rtpos" className="round-but black-but">
            Import from POS
          </label>
        </div>
        <div className="exel-part-action">
          <div className="download-link">
            <a
              href={getUrl("downCurrentCart")}
              className="round-but active-but this_data_excel"
              onClick={(event) => {
                event.preventDefault();
                this.props.downloadCart();
              }}
            >
              Download Current Cart
            </a>
            <a
              href={getUrl("downSampleCart")}
              className="round-but active-but this_template_excel"
            >
              Download Sample Cart Import
            </a>
          </div>
          <div className="download-link">
            <a href={getUrl("downRtposSample")} target="_blank">
              Download POS Sample
            </a>
            <a href={getUrl("downCiSample")} target="_blank">
              Download Suggested Order Sample
            </a>
            <a href={getUrl("downDiSample")} target="_blank">
              Download Order Import Sample
            </a>
          </div>
        </div>
        <div className="execel-link-wrapper">
          <div className="download-content">
            <p>
              <strong>Notes:</strong>
            </p>
            <ul>
              <li>Files must be in xlsx format only.</li>
              <li>
                Please use the column headers found in the upload sample file
                that matches your input file.
              </li>
            </ul>
          </div>
        </div>
        <form
          style={{ display: "none" }}
          method="POST"
          enctype="multipart/form-data"
          id="import-form"
          action={getUrl("cartImport")}
        >
          <input
            type="file"
            id="import_excel"
            name="template_file"
            accept=".xlsx, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            onChange={(event) => {
              event.preventDefault();
              document.getElementById("import-form").submit();
            }}
          />
        </form>
        <form
          style={{ display: "none" }}
          method="POST"
          enctype="multipart/form-data"
          id="import-form-rtpos"
          action={getUrl("rtposImport")}
        >
          <input
            type="file"
            id="import_excel_rtpos"
            name="template_file"
            accept=".xlsx, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            onChange={(event) => {
              event.preventDefault();
              document.getElementById("import-form-rtpos").submit();
            }}
          />
        </form>
      </div>
    );
  }
}

export default ImportExport;
