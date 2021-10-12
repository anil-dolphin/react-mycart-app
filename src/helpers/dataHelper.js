import _ from "lodash";

const deployMode = "DEV"; // DEV / PROD

if (deployMode === "PROD") {
} else {
  window.myCartFn = {};
  window.myCartFn.updateCartSection = function () {
    console.log("DEV MODE");
  };
  window.myCartFn.openProductPopup = function (url) {
    console.log(url);
  };
  window.mycart = {
    filters: {
      // regions: [{ label: "MidWest" }, { label: "West" }],
      regions: false,
      states: [
        { id: "39", label: "CA" },
        { id: "75", label: "IN" },
        { id: "171", label: "TN" },
      ],
      cities: [
        { label: "IRWINDALE" },
        { label: "Murfreesboro" },
        { label: "Pendleton" },
        { label: "Warren" },
      ],
      categories: [
        { id: "414", label: "Audio" },
        { id: "480", label: "Cables" },
        { id: "450", label: "Cases" },
        { id: "570", label: "Grip" },
        { id: "495", label: "In-Vehicle Accessories" },
        { id: "9356", label: "Kicksticks & Phone Stands" },
        { id: "393", label: "Power" },
        { id: "462", label: "Screen Protection" },
      ],
      brands: [
        { id: "1053478", label: "Anker / Soundcore" },
        { id: "8690", label: "Bitty Boomers" },
        { id: "528", label: "POPSOCKETS" },
        { id: "531", label: "PureGear" },
        { id: "7825", label: "Simple" },
        { id: "8699", label: "JLab" },
        { id: "1053481", label: "Kingston Memory" },
        { id: "1053484", label: "Powertek" },
        { id: "1053487", label: "SVN Sound" },
        { id: "1053490", label: "Tech21" },
        { id: "1053493", label: "Zizo" },
      ],
      makes: [
        { id: "24", label: "Apple" },
        { id: "7886", label: "Alcatel" },
        { id: "7898", label: "OnePlus" },
        { id: "7901", label: "T-Mobile" },
        { id: "228", label: "Motorola" },
        { id: "279", label: "Samsung" },
      ],
      models: [
        { id: "7269", label: "iPhone 11" },
        { id: "1347585", label: "iPhone 13" },
        { id: "1053505", label: "iPhone 13 Mini" },
        { id: "1053499", label: "iPhone 13 Pro" },
        { id: "1053502", label: "iPhone 13 Pro Max" },
        { id: "7798", label: "iPhone SE (2020)" },
        { id: "105", label: "iPhone XR" },
        { id: "1305696", label: "Go Flip 4" },
        { id: "434693", label: "JOY TAB 2" },
        { id: "1263873", label: "Nord N200 5G" },
        { id: "1263876", label: "Nord N10 5G" },
        { id: "8051", label: "T-Mobile\u00ae REVVL V+ 5G" },
        { id: "1053511", label: "Milpitas" },
        { id: "9791", label: "Moto G Stylus 5G" },
        { id: "467912", label: "Galaxy A12" },
        { id: "468215", label: "Galaxy A52 5G" },
        { id: "468218", label: "Galaxy A32 5G" },
        { id: "1264242", label: "Galaxy A02s" },
        { id: "1263867", label: "A 7 Lite" },
      ],
      makeModelRel: {
        24: ["7269", "1347585", "1053505", "1053499", "1053502", "7798", "105"],
        7886: ["1305696", "434693"],
        7898: ["1263873", "1263876"],
        7901: ["8051"],
        228: ["1053511", "9791"],
        279: ["467912", "468215", "468218", "1264242", "1263867"],
      },
    },
    urls: {
      getProducts:
        deployMode === "PROD"
          ? "https://scp.demoproject.info/mycart/api/products"
          : "https://scp.demoproject.info/mycart/react/products",
      getLocations:
        deployMode === "PROD"
          ? "https://scp.demoproject.info/mycart/api/locations"
          : "https://scp.demoproject.info/mycart/react/locations",
      getProdLocQty:
        deployMode === "PROD"
          ? "https://scp.demoproject.info/mycart/api/quote"
          : "https://scp.demoproject.info/mycart/react/quote",
      getCartSummary:
        deployMode === "PROD"
          ? "https://scp.demoproject.info/mycart/api/cartdata/"
          : "https://scp.demoproject.info/mycart/react/cartdata/",
      updateOrder:
        "https://scp.demoproject.info/index.php/checkout/cart/updatePost/",
      manageLocations:
        "https://scp.demoproject.info/index.php/customer/address/location/",
      selectShipping:
        "https://scp.demoproject.info/index.php/multishipping/checkout/shipping/",
      downCurrentCart:
        "https://scp.demoproject.info/metro/index.php/customer/cart/export/",
      downSampleCart:
        "https://scp.demoproject.info/index.php/customer/cart/exportTemplate/",
      downRtposSample:
        "https://scp.demoproject.info/media/sample/rtpos_sample.xlsx",
      downCiSample: "https://scp.demoproject.info/media/sample/ci_sample.xlsx",
      downDiSample: "https://scp.demoproject.info/media/sample/di_sample.xlsx",
      cartImport:
        "https://scp.demoproject.info/index.php/customer/cart/import/",
      rtposImport:
        "https://scp.demoproject.info/index.php/customer/cart/importrtpos/",
    },
    currency: "$",
    showAsNew: true,
    importPending: true,
  };
}

export async function getProducts(postData) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
      Accept: "*/*",
    },
    body: JSON.stringify(postData),
  };
  return await fetch(getUrl("getProducts"), requestOptions)
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error(error);
    });
}

export async function getLocations(postData) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
      Accept: "*/*",
    },
    body: JSON.stringify(postData),
  };
  return await fetch(getUrl("getLocations"), requestOptions)
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error(error);
    });
}

export async function getProdLocQty() {
  return await fetch(getUrl("getProdLocQty"))
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error(error);
    });
}

export async function getCartSummary() {
  return await fetch(getUrl("getCartSummary"))
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error(error);
    });
}

export async function updateQtys(postData) {
  var formBody = [];

  _.map(postData.cart, (locations, productId) => {
    _.map(locations, (qty, locationId) => {
      formBody.push(`cart[${productId}][${locationId}][qty]=${qty}`);
    });
  });

  formBody.push(`form_key=${getFormKey()}`);
  formBody.push(`is_single=1`);
  formBody = formBody.join("&");

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "X-Requested-With": "XMLHttpRequest",
      Accept: "*/*",
    },
    body: formBody,
  };
  return await fetch(getUrl("updateOrder"), requestOptions)
    .then((response) => response.json())
    .then((data) => console.error(data))
    .catch((error) => {
      console.error(error);
    });
}

export async function updatePos(postData) {
  var formBody = [];

  _.map(postData.po, (po, locationId) => {
    formBody.push(`po[${locationId}]=${po}`);
  });
  if (
    document.getElementsByName("form_key") &&
    document.getElementsByName("form_key")[0] &&
    document.getElementsByName("form_key")[0].value
  )
    formBody.push(
      `form_key=${document.getElementsByName("form_key")[0].value}`
    );
  formBody.push(`is_single=1`);
  formBody.push(`is_po=1`);
  formBody = formBody.join("&");

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "X-Requested-With": "XMLHttpRequest",
      Accept: "*/*",
    },
    body: formBody,
  };
  return await fetch(getUrl("updateOrder"), requestOptions)
    .then((response) => response.json())
    .then((data) => console.error(data))
    .catch((error) => {
      console.error(error);
    });
}

export function downloadCart(postData) {
  var form = document.createElement("form");

  _.map(postData.qty, (locations, productId) => {
    _.map(locations, (qty, locationId) => {
      var ele = document.createElement("input");
      ele.value = qty;
      ele.name = `cart[${productId}][${locationId}][qty]`;
      form.appendChild(ele);
    });
  });

  // _.map(postData.po, (po, locationId) => {
  //   var ele = document.createElement("input");
  //   ele.value = po;
  //   ele.name = `po[${locationId}]`;
  //   form.appendChild(ele);
  // });

  var ele = document.createElement("input");
  ele.value = getFormKey();
  ele.name = `form_key`;
  form.appendChild(ele);

  _.map(["location_region", "region_code", "location_city"], (name) => {
    var ele = document.createElement("input");
    ele.value = "0";
    ele.name = name;
    form.appendChild(ele);
  });

  form.method = "POST";
  form.enctype = "application/x-www-form-urlencoded";
  form.action = getUrl("downCurrentCart");
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}

export function getFormKey() {
  return document.getElementsByName("form_key") &&
    document.getElementsByName("form_key")[0] &&
    document.getElementsByName("form_key")[0].value
    ? document.getElementsByName("form_key")[0].value
    : "";
}
export function getMyCartField(field = null) {
  if (field != null) {
    return window.mycart[field];
  }
  return window.mycart;
}
export function getFilterFieldsData(field = null) {
  const filters = getMyCartField("filters");
  if (field !== null) return filters[field];
  return window.mycart.filters;
}
export function getUrl(type) {
  const urls = getMyCartField("urls");
  return urls[type];
}
export function getCurrency() {
  return getMyCartField("currency");
}
export function getShowAsNew() {
  return getMyCartField("showAsNew");
}
export function importPending() {
  return getMyCartField("importPending");
}
export function updateCartSection() {
  window.myCartFn.updateCartSection();
}
export function openProductPopup(url) {
  window.myCartFn.openProductPopup(url);
}
