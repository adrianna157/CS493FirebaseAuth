'use strict';

const AWS = require("aws-sdk");
const uuid = require('uuid');
const s3 = new AWS.S3();
const docClient = new AWS.DynamoDB.DocumentClient();


const lambda = new AWS.Lambda({
  region: 'us-east-1'
})

module.exports.addinglist = (event) => {

  const s3params = {
    Bucket: "music-storage-cs493192711-dev",
    Key: process.env.accessKeyId,
    ACL: "public-read",
  };
  console.log(event.Records)

  event.Records.forEach((record) => {
    const filename = record.s3.object.key;
    const eventName = record.eventName;
    const eventTime = record.eventTime;
    const eventSource = record.eventSource;

    let params = {
      TableName: 'AllSongsTable',
      Item: {
        namesong: filename,
        eventTime: eventTime,
        eventSource: eventSource,
        data: Date.now()
      }
    };

    docClient.put(params, function (err, data) {
      if (err)
        callback(err, null);
      else
        callback(null, data);
    });

  })
 
};

