const express = require("express");
const bodyParser = require("body-parser");
const app = express();
require("dotenv").config();
const deliveryService = require("./delivery-service");
const healthService = require("./health-check");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use("/api/delivery", deliveryService);
app.use("/health", healthService);

app.listen(process.env.PORT, () => {
  console.info(
    `ShipFast Delivery Service API Listening at Port ${process.env.PORT}`
  );
});
