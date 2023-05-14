const express = require("express");
const router = express.Router();
router.use(express.json());
const _ = require("lodash");
const { cancelDelivery, getStatusByTrackingCode } = require("./dynamodb");

// api endpoint for getting delivery status by tracking code
router.get("/:tracking_code", async (req, res) => {
  const { tracking_code } = req.params;
  try {
    const deliveryStatus = await getStatusByTrackingCode(tracking_code);
    if (_.isEmpty(deliveryStatus))
      res.status(400).json({ err: "Wrong tracking code, Please check again!" });
    res.status(200).json(deliveryStatus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ err: `Something went wrong` });
  }
});

// api endpoint for updating a delivery as cancel
router.put("/cancel/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const cancelledDelivery = await cancelDelivery(id);
    res.status(200).json(cancelledDelivery);
  } catch (error) {
    console.error(error);
    res.status(500).json({ err: `Something went wrong` });
  }
});

module.exports = router;
