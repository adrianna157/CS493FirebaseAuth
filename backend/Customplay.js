'use strict';

const AWS = require("aws-sdk");
const uuid = require('uuid');
const s3 = new AWS.S3();
const docClient = new AWS.DynamoDB.DocumentClient({
  params: { TableName: 'music' }
}

);


const lambda = new AWS.Lambda({
  region: 'us-east-1'
})

module.exports.newplaylist = (event) => {

  const params = {
    TableName: 'Customplaylist',
    Item: {
      id: uuid.v1(),
      newplaylist: data.newplaylist,
      namesong: data.namesong
    }
  }
  docClient.put(params,(err,data)=>{
  if (err)
   { console.log("error in creating playlist",err)}
  else {
    item = { 'key': { 'S': file_name } }
    const timestamp = new Date().getTime();
    const data= JSON.parse(event.body);
    dynamodb_client.put_item(TableName = 'Customplaylist', Item = item)
    console.log("song added in new playlist",data)
  }


});
};