require("dotenv").config();
const axios = require("axios");

const TOKEN = process.env.TOKEN;

const priorityMap = {
  Placement: 3,
  Result: 2,
  Event: 1
};

async function getTopNotifications() {
  try {
    const response = await axios.get(
      "http://20.207.122.201/evaluation-service/notifications",
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`
        }
      }
    );

    const notifications = response.data.notifications;

    const sorted = notifications.sort((a, b) => {
      if (priorityMap[b.Type] !== priorityMap[a.Type]) {
        return priorityMap[b.Type] - priorityMap[a.Type];
      }
      return new Date(b.Timestamp) - new Date(a.Timestamp);
    });

    const top10 = sorted.slice(0, 10);

    console.log("Top 10 Notifications:");
    console.log(top10);

  } catch (error) {
    console.error("Error:", error.message);
  }
}

getTopNotifications();