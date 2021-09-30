window.mycart = {
  filters: {
    regions: [{ label: "MidWest" }, { label: "West" }],
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
};

export async function getTest(postData) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
      Accept: "*/*",
    },
    body: JSON.stringify(postData),
  };
  return await fetch(
    `https://scp.demoproject.info/mycart/api/test`,
    requestOptions
  )
    .then((response) => response.json())
    .then((data) => console.error(data))
    .catch((error) => {
      console.error(error);
    });
}

export async function getTestProducts(postData) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
      Accept: "*/*",
    },
    body: JSON.stringify(postData),
  };
  return await fetch(
    `https://scp.demoproject.info/mycart/api/products`,
    requestOptions
  )
    .then((response) => response.json())
    .then((data) => console.error(data))
    .catch((error) => {
      console.error(error);
    });
}

export async function getTestLocations(postData) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
      Accept: "*/*",
    },
    body: JSON.stringify(postData),
  };
  return await fetch(
    `https://scp.demoproject.info/mycart/api/locations`,
    requestOptions
  )
    .then((response) => response.json())
    .then((data) => console.error(data))
    .catch((error) => {
      console.error(error);
    });
}

export async function testUpdateQtys(postData) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
      Accept: "*/*",
    },
    body: JSON.stringify(postData),
  };
  return await fetch(
    `https://scp.demoproject.info/mycart/api/test`,
    requestOptions
  )
    .then((response) => response.json())
    .then((data) => console.error(data))
    .catch((error) => {
      console.error(error);
    });
}

export async function getProducts(currentPage, limit) {
  return await fetch(
    `https://scp.demoproject.info/mycart/react/products/page/${currentPage}/limit/${limit}`
  )
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error(error);
    });
}

export async function getLocations(currentPage, limit) {
  return await fetch(
    `https://scp.demoproject.info/mycart/react/locations/page/${currentPage}/limit/${limit}`
  )
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error(error);
    });
}

export async function getProdLocQty() {
  return await fetch("https://scp.demoproject.info/mycart/react/quote")
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error(error);
    });
}

export function getFilterFieldsData(field = null) {
  if (field != null) {
    return window.mycart.filters[field];
  }
  return window.mycart.filters;
}
