const config = require('config'),
  aws = require('aws-sdk'),
  promisify = require('util').promisify,
  put = promisify(docClient.put)

aws.config.update({
  region: config.awsRegion,
})

const docClient = new aws.DynamoDB.DocumentClient()

module.exports = async (data) => {
  const params = {
    TableName: config.dynamoTableName,
    Item: data,
  }

  return put(params)
}
