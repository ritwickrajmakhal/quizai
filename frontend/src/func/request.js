const request = async (path, method, data) => {
  try {
    const response = await fetch(process.env.REACT_APP_STRAPI_API_URL + path, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + process.env.REACT_APP_STRAPI_API_KEY,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return response.json();
  } catch (error) { }
};

module.exports = request;
