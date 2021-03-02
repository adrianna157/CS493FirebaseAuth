'use strict';

const AWS = require("aws-sdk");
const uuid = require('uuid');
const s3 = new AWS.S3({
  params: { Bucket: 'music-storage-cs493192711-dev' }
});

const docClient = new AWS.DynamoDB.DocumentClient(
  {
    params: { TableName: 'music' }
  }
);


const lambda = new AWS.Lambda({
  region: 'us-east-1'
})


module.exports.getsonglist = (event, context, callback) => {

  s3.listObjects(params, function (err, data) {
    if (err) {
      console.log(err, err.stack);
      return;
    }

    const Audio = [];
    data.Contents.forEach(namesong => {
      Audio.push(namesong.Key)
    })

  })
};

module.exports.getsongName = (event) => {

  s3.getObject(params, function (err, data) {
    if (err)
      console.log(err, err.stack);
    else
    console.log(data);
  })

const songName=[]
data.Contents.forEach(namesong => {
  songName.push(namesong.Key)
})

if (songName != null) {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify(data.key)
  };
  callback(null, response);
}

else {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true // 
    },
    body: JSON.stringify({ message: "this song dooes not exist" })
  };
  callback(null, response);
}
};