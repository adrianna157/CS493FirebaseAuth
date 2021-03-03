const params = {
  TableName: music,
  KeyConditionExpression: "genre = :genre",
  ExpressionAttributeValues: {
    ":genre": genre,
  },
};
docClient.query(params, function (err, data) {
  if (err) ppJson(err);
  // an error occurred
  else ppJson(data); // successful response
});
