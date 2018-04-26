var elasticsearch = require('elasticsearch')

var client = new elasticsearch.Client({
  hosts: [
    'http://ec2-13-125-205-11.ap-northeast-2.compute.amazonaws.com:8080',
  ]
});

module.exports = client;
