const axios = require("axios");

const log = async (stack, level, pkg, message, token) => {
  try {
    await axios.post(
      "http://20.207.122.201/evaluation-service/logs",
      {
        stack: stack,
        level: level,
        package: pkg,
        message: message,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (err) {
    // avoid console.log (optional)
  }
};

module.exports = log;