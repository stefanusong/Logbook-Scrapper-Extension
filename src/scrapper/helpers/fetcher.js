const axios = require("axios");
const { HttpMethod } = require("./../utils/constant");

const API_URL = "https://activity-enrichment.apps.binus.ac.id";

async function fetch(endpoint, options = { method: HttpMethod.GET }) {
  let { method, body } = options;
  const url = API_URL + endpoint;

  const axiosConfig = {
    method,
    url,
    data: body,
  };

  try {
    const response = await axios(axiosConfig);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  fetch,
};
