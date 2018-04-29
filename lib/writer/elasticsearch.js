const elasticsearch = require('elasticsearch'),
  config = require('config'),
  client = elasticsearch.Client(config.elasticsearch),
  promisify = require('util').promisify,
  upload = promisify(client.index)

module.exports = (data) => {
  const id = data.id
  delete data.id

  return upload({
    index: 'channels',
    type: '_doc',
    id: id,
    body: data,
  })
}
