const AWS = require('aws-sdk');
require('dotenv').config();

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
});

const dynamodb = new AWS.DynamoDB();
const docClient = new AWS.DynamoDB.DocumentClient();

// Table names
const TABLES = {
  USERS: 'Users',
  USER_PROGRESS: 'UserProgress', 
  USER_SUBSCRIPTIONS: 'UserSubscriptions',
  LEVELS: 'Levels',
  CONTENT: 'Content'
};

module.exports = {
  dynamodb,
  docClient,
  TABLES
};