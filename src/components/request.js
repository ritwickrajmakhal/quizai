const request = async (path, method, data) => {
  try {
    const response = await fetch(process.env.REACT_APP_STRAPI_API_URL + path, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return response.json();
  } catch (error) {
    // Handle the error here
    console.error("Error:", error);
    throw error; // Rethrow the error if necessary
  }
};

module.exports = request;
