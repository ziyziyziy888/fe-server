const request = require('request-promise');
const config = require('config');

module.exports = (ctx, next) => {
  return request({
    method: 'POST',
    uri: config.url.mallApi + ctx.originalUrl,
    qs: Object.assign({}, ctx.request.body)
  });
}
