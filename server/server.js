const express = require("express");
const cors = require("cors");
const path = require("path");          // ← ADD THIS

const app = express();

// ==================== CORS FOR PRODUCTION ====================
var corsOptions = {
  // Allow both your free subdomain and the DO preview URL
  origin: [
    "http://localhost:3000",           // local dev
    "https://samplekamesh.mooo.com",   // ← CHANGE TO YOUR REAL SUBDOMAIN
    // add more domains later if needed
  ],
  credentials: true
};
app.use(cors(corsOptions));

// parse requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================== SERVE REACT BUILD (IMPORTANT!) ====================
// This makes Express serve your React static files when someone visits /
app.use(express.static(path.join(__dirname, "../client/build")));

// Your API routes (keep them BEFORE the catch-all handler)
require("./app/routes/turorial.routes")(app);

// ==================== SYNC DATABASE ====================
const db = require("./app/models");

db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

// Simple root route (optional – React will take over)
app.get("/api", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

// ==================== CATCH-ALL: SERVE index.html FOR REACT ROUTER ====================
// This is CRUCIAL for React Router (BrowserRouter) to work on refresh / direct links
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

// ==================== PORT ====================
const PORT = process.env.PORT || 5000;    // ← CHANGE FROM 8080 → 5000
app.listen(PORT, "0.0.0.0", () => {        // ← ADD "0.0.0.0" so it listens externally
  console.log(`Server is running on port ${PORT}.`);
});