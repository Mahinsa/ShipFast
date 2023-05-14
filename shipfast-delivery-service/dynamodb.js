const AWS = require("aws-sdk");
const _ = require("lodash");
require("dotenv").config();

AWS.config.update({
  region: process.env.AWS_DEFAULT_REGION,
});

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const TABLE_ORDERS = "shipfast_orders";

// delivery status by tracking code
const getStatusByTrackingCode = async (tracking_code) => {
  const params = {
    TableName: TABLE_ORDERS,
    IndexName: "TrackingCodeIndex",
    KeyConditionExpression: "tracking_code = :value",
    ExpressionAttributeValues: {
      ":value": tracking_code,
    },
  };

  const result = await dynamoClient.query(params).promise();
  console.log("result", result);
  return _.pick(result.Items[0], ["tracking_code", "status"]);
};

// cancel delivery
const cancelDelivery = async (id) => {
  const params = {
    TableName: TABLE_ORDERS,
    Key: {
      order_id: id,
    },
    UpdateExpression: "set #status = :v_status",
    ExpressionAttributeNames: {
      "#status": "status",
    },
    ExpressionAttributeValues: {
      ":v_status": "CANCEL",
    },
    ReturnValues: "ALL_NEW",
  };

  const result = await dynamoClient.update(params).promise();
  console.log("result", result);
  return _.pick(result.Attributes, ["order_id", "tracking_code", "status"]);
};

module.exports = {
  getStatusByTrackingCode,
  cancelDelivery,
};
