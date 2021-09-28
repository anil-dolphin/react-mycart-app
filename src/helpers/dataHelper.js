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
