const axios = require("axios");

const BASE_URL = "http://20.207.122.201/evaluation-service";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhYTcxODhAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwMTQwNCwiaWF0IjoxNzc3NzAwNTA0LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiODk4ODVhYzItZGQzMy00MDc2LWFlMmItYTYwODk5OTE4OTA3IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiYW5hbnlhIGF3YXN0aGkiLCJzdWIiOiJmMzcwYWM2ZC1kMDUxLTRhZWEtOTgxMC1iMzM2MTdkZTE3YTUifSwiZW1haWwiOiJhYTcxODhAc3JtaXN0LmVkdS5pbiIsIm5hbWUiOiJhbmFueWEgYXdhc3RoaSIsInJvbGxObyI6InJhMjMxMTA1NjAzMDA3MCIsImFjY2Vzc0NvZGUiOiJRa2JweEgiLCJjbGllbnRJRCI6ImYzNzBhYzZkLWQwNTEtNGFlYS05ODEwLWIzMzYxN2RlMTdhNSIsImNsaWVudFNlY3JldCI6ImRwcFBOa3VWVm1UeFhlbWoifQ.kTiGFnkuB-iFVJ8YrovMi6yiw-kJj0WTHbZRTrC68oQ";

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