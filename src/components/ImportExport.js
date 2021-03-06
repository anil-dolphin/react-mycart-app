import React from "react";
import { getUrl, getFormKey, importMsg } from "../helpers/dataHelper";

class ImportExport extends React.Component {
  validateExcelFile = (ext) => {
    ext = ext.match(/\.([^\.]+)$/)[1];
    return ext === "xlsx" || ext === "xls";
  };

  render() {
    return (
      <div className="exel-part">
        <h3>Prefer Excel?</h3>
        {importMsg() ? <p className="csv_import_status">{importMsg()}</p> : ""}
        <p>
          Download your current cart as a spreadsheet, update the quantities and
          we will create a shopping cart for you.
        </p>
        <div className="import-execel-wrapper">
          <label htmlFor="import_excel" className="round-but black-but">
            Import SKU by Store Cart
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
              Download SKU by Store Current Cart
            </a>
            <a
              href={getUrl("downSampleCart")}
              className="round-but active-but this_template_excel"
            >
              Download SKU by Store Sample
            </a>
          </div>
          <div className="download-link">
            <a href={getUrl("downRtposSample")} target="_blank">
              Download RTPOS Import Sample
            </a>
            <a href={getUrl("downRqSample")} target="_blank">
              Download RQ Import Sample
            </a>
            <a href={getUrl("downCiSample")} target="_blank">
              Download Generic Import Sample1
            </a>
            <a href={getUrl("downDiSample")} target="_blank">
              Download Generic Import Sample2
            </a>
          </div>
        </div>
        <div className="execel-link-wrapper">
          <div className="download-content">
            <p>
              <strong>Notes:</strong>
            </p>
            <ul>
              <li>Files must be in xlsx/xls format only.</li>
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
          encType="multipart/form-data"
          id="import-form"
          action={getUrl("cartImport")}
        >
          <input type="hidden" name="form_key" value={getFormKey()} />
          <input
            type="file"
            id="import_excel"
            name="template_file"
            accept=".xlsx, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            onChange={(event) => {
              event.preventDefault();
              if (this.validateExcelFile(event.target.value)) {
                this.props.showLoader({
                  show: true,
                  title: "Please wait",
                  content: <div>Importing Products...</div>,
                });
                document.getElementById("import-form").submit();
              } else {
                alert("Invalid file. Only excel files are supported.");
              }
            }}
          />
        </form>
        <form
          style={{ display: "none" }}
          method="POST"
          encType="multipart/form-data"
          id="import-form-rtpos"
          action={getUrl("rtposImport")}
        >
          <input type="hidden" name="form_key" value={getFormKey()} />
          <input
            type="file"
            id="import_excel_rtpos"
            name="template_file"
            accept=".xlsx, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            onChange={(event) => {
              event.preventDefault();
              if (this.validateExcelFile(event.target.value)) {
                this.props.showLoader({
                  show: true,
                  title: "Please wait",
                  content: <div>Importing Products...</div>,
                });
                document.getElementById("import-form-rtpos").submit();
              } else {
                alert("Invalid file. Only excel files are supported.");
              }
            }}
          />
        </form>
      </div>
    );
  }
}

export default ImportExport;
