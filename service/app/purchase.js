import request from 'request-promise';
import config from 'config';

export default (ctx, next) => {
  return request({
    method: 'POST',
    uri: config.url.mallApi + ctx.originalUrl,
    qs: Object.assign({}, ctx.request.body)
  });
}
