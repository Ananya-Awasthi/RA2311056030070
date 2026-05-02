require("dotenv").config();

const axios = require("axios");


const BASE_URL = "http://20.207.122.201/evaluation-service";
const TOKEN = process.env.TOKEN;

const headers = {
  Authorization: `Bearer ${TOKEN}`
};

const getDepots = async () => {
  const res = await axios.get(`${BASE_URL}/depots`, { headers });
  return res.data.depots;
};

const getVehicles = async () => {
  const res = await axios.get(`${BASE_URL}/vehicles`, { headers });
  return res.data.vehicles;
};

module.exports = { getDepots, getVehicles };