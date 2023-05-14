const AWS = require("aws-sdk");
const _ = require("lodash");
require("dotenv").config();

AWS.config.update({
  region: process.env.AWS_DEFAULT_REGION,
});

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const TABLE_USERS = "shipfast_users";

const saveUser = async (user) => {
  const params = {
    TableName: TABLE_USERS,
    Item: {
      email: user.email,
      name: user.name,
      password: user.password,
      created_date: new Date().toISOString(),
      updated_date: new Date().toISOString(),
    },
  };
  await dynamoClient.put(params).promise();
  return params.Item;
};

// delivery status by tracking code
const getUserByEmail = async (email) => {
  const params = {
    TableName: TABLE_USERS,
    Key: {
      email,
    },
  };
  const result = await dynamoClient.get(params).promise();
  return _.pick(result.Item, ["name", "email", "password"]);
};

module.exports = {
  getUserByEmail,
  saveUser,
};
