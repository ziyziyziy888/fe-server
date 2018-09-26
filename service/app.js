import Koa from 'koa'
import path from 'path'
import http from 'http'
import koaStatic from 'koa-static'
import views from 'koa-views';
import onError from 'koa-onerror';
import logger from 'koa-logger';
import bodyParser from 'koa-bodyparser';
import Raven from 'raven';
import config from 'config';

import router from './routes'

const app = new Koa();
const port = parseInt(config.port);
Raven.config(config.sentry.DSN).install();

// 自定义中间件(展示用)
app.use(async (ctx, next) => {
	const start = new Date()
	await next()
	const ms = new Date() - start
	console.log(`User defined log: ${ctx.method} ${ctx.url} - ${ms}ms`)
})

// Logger 放置位置需要靠前一些
app.use(logger());

// 静态资源
app.use(koaStatic(path.join(__dirname, '../public')));

// 模版资源
app.use(views(path.join(__dirname, '../views'), {
	extension: 'ejs'
}));

// body处理
app.use(bodyParser());

// 路由
app.use(router.routes());

// 错误模版 怎样生效待check
onError(app, {
  template: 'views/500.ejs'
});

// 错误处理
// sentry 注册
app.on('error', error => {
  Raven.captureException(error, function (error, eventId) {
    console.log('Reported io error: ' + eventId);  // eventId也可以记录到log当中方便追溯
  });
})

// 项目启动
const server = http.createServer(app.callback());
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

server.on('listening', () => {
	console.log('Listening on port: %d', port)
})

export default app
