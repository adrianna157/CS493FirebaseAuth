const express = require("serverless-express/express");
const handler = require("serverless-express/handler");
const AWS = require("aws-sdk");
const _ = require("lodash");
const MUSIC_TABLE = "music";
const bodyParser = require("body-parser");
const BUCKET = "music-storage-cs493192711-dev";
const USER_TABLE = "users";
const SQS_QUEUE_URL =
  "https://sqs.us-east-1.amazonaws.com/466469553065/reporting";



exports.handler = async function (event, context) {
  event.Records.forEach((record) => {
    const { body } = record;
    console.log(body);
  });
  return {};
};




