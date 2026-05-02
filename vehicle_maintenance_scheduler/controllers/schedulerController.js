const { getDepots, getVehicles } = require("../services/apiService");
const knapsack = require("../services/knapsack");
const log = require("../../logging_middleware/logger");

const TOKEN = "YOUR_TOKEN";

exports.schedule = async (req, res) => {
  try {
    await log("backend", "info", "controller", "Fetching depots", TOKEN);

    const depots = await getDepots();
    const vehicles = await getVehicles();

    const result = depots.map(depot => {

      // ✅ SORT by efficiency (impact per hour)
      const sortedVehicles = [...vehicles].sort((a, b) => {
        return (b.Impact / b.Duration) - (a.Impact / a.Duration);
      });

      // ✅ LIMIT tasks (important)
      const limit = Math.min(vehicles.length, Math.floor(depot.MechanicHours / 2));

const limitedVehicles = sortedVehicles.slice(0, limit);

      // ✅ APPLY KNAPSACK
      const selectedTasks = knapsack(limitedVehicles, depot.MechanicHours);

      return {
        depotId: depot.ID,
        totalImpact: selectedTasks.reduce((sum, t) => sum + t.Impact, 0),
        tasks: selectedTasks.map(t => t.TaskID)
      };
    });

    await log("backend", "info", "controller", "Scheduling done", TOKEN);

    res.json(result);

  } catch (err) {
    await log("backend", "error", "controller", err.message, TOKEN);
    res.status(500).json({ error: err.message });
  }
};