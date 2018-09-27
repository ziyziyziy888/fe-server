const Koa = require('koa');
const path = require('path');
const http = require('http');
const koaStatic = require('koa-static');
const views = require('koa-views');
const onError = require('koa-onerror');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
const Raven = require('raven');
const config = require('config');

const router = require('./routes');

const MCServer = function(options) {
  if(!(this instanceof MCServer)){
    return new MCServer(options);
  }
  this.options = options || config;
  this.app = new Koa();
};

MCServer.Controller = function() {
  return this;
};

MCServer.Controller.prototype.send = function(body) {
  this.ctx.body = body;
};

MCServer.prototype.load = function(tool) {
  console.log('load功能还未实现');
}

MCServer.prototype.loadDefault = function(tool) {
  Raven.config(config.sentry.DSN).install();

  // 自定义中间件(展示用)
  this.app.use(async (ctx, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log(`User defined log: ${ctx.method} ${ctx.url} - ${ms}ms`)
  })

  // Logger 放置位置需要靠前一些
  this.app.use(logger());

  // 静态资源
  this.app.use(koaStatic(path.join(__dirname, '../public')));

  // 模版资源
  this.app.use(views(path.join(__dirname, '../views'), {
    extension: 'hbs',
    map: { hbs: 'handlebars' },
  }));

  // body处理
  this.app.use(bodyParser());

  // 路由
  this.app.use(router.routes());

  // 错误模版 怎样生效待check
  onError(this.app, {
    template: 'views/500.hbs'
  });

  // 错误处理
  // sentry 注册
  this.app.on('error', error => {
    Raven.captureException(error, function (error, eventId) {
      console.log('Reported io error: ' + eventId);  // eventId也可以记录到log当中方便追溯
    });
  })
  return this;
}

MCServer.prototype.start = function(callback) {
  const server = http.createServer(this.app.callback());
  const port = this.options.port;
  server.listen(port);

  // 启动错误
  server.on('error', error => {
    Raven.captureException(error, function (error, eventId) {
      console.log('Reported creash error: ' + eventId);
    });
    // 下面的代码根本没有生效
    if (error.syscall !== 'listen') {
      throw error
    }

    switch(error.code) {
      case 'EACCES':
        console.error(`${port} requires elevated privileges`)
        process.exit(1)
        break
      case 'EADDRINUSE':
       console.error(`${port} is already in use`)
       process.exit(1)
       break
      default:
        throw error
    }
  })

  // 启动监听
  server.on('listening', () => {
    console.log('Listening on port: %d', port);
    callback && callback();
  })

  return this;
};

module.exports = MCServer;
