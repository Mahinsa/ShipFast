const express = require("express");
const router = express.Router();
router.use(express.json());
const _ = require("lodash");
const { getOrderById, getOrders, addOrder } = require("./dynamodb");

// api endpoint for Adding an order for delivery
router.post("/add", async (req, res) => {
  const order = req.body;
  try {
    const addedOrder = await addOrder(order);
    res.status(201).json(addedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ err: `Something went wrong` });
  }
});

// api endpoint for getting Order by OrderId
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const order = await getOrderById(id);
    if (_.isEmpty(order))
      res.status(400).json({ err: "Wrong order id, Please check again!" });
    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ err: `Something went wrong` });
  }
});

// api endpoint for getting All Orders
router.get("/", async (req, res) => {
  try {
    const orders = await getOrders();
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ err: `Something went wrong` });
  }
});

module.exports = router;
