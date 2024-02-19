const request = async (path, method, data) => {
  const response = await fetch(process.env.REACT_APP_STRAPI_API_URL + path, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

module.exports = request;