const express = require("express");
const bodyParser = require("body-parser");
const app = express();
require("dotenv").config();
const authService = require("./auth");
const healthService = require("./health-check");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use("/api/auth", authService);
app.use("/health", healthService);

app.listen(process.env.PORT, () => {
  console.info(
    `ShipFast Auth Service API Listening at Port ${process.env.PORT}`
  );
});
