const elasticsearch = require('elasticsearch'),
  config = require('config')

module.exports = elasticsearch.Client(config.elasticsearch)
