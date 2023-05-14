const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

AWS.config.update({
  region: process.env.AWS_DEFAULT_REGION,
});

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const TABLE_ORDERS = "shipfast_orders";

const addOrder = async (order) => {
  const params = {
    TableName: TABLE_ORDERS,
    Item: {
      order_id: uuidv4(),
      tracking_code: uuidv4(),
      status: "ONGOING",
      customer_name: order.customerName,
      customer_address: order.address,
      item_details: order.item,
      created_date: new Date().toISOString(),
      updated_date: new Date().toISOString(),
    },
  };
  await dynamoClient.put(params).promise();
  return params.Item;
};

// get order by orderId
const getOrderById = async (id) => {
  const params = {
    TableName: TABLE_ORDERS,
    Key: {
      order_id: id,
    },
  };
  const result = await dynamoClient.get(params).promise();
  console.log("result", result);
  return result.Item;
};

// get all orders
const getOrders = async () => {
  const params = {
    TableName: TABLE_ORDERS,
  };

  const result = await dynamoClient.scan(params).promise();
  console.log("result", result);
  return result.Items;
};

module.exports = {
  addOrder,
  getOrders,
  getOrderById,
};
