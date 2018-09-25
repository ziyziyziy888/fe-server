import Koa from 'koa'
import path from 'path'
import http from 'http'
import koaStatic from 'koa-static'
import views from 'koa-views'
import koaOnError from 'koa-onerror'

import config from './config'
import router from './routes'

const app = new Koa()

app.use(koaStatic(path.join(__dirname, '../public')))

app.use(views(path.join(__dirname, '../views'), {
	extension: 'ejs'
}))

koaOnError(app, {
	template: 'views/500.ejs'
})

app.use(async (ctx, next) => {
	const start = new Date()
	await next()
	const ms = new Date() - start
	console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

app.use(router.routes())


const port = parseInt(config.port || '3000')
const server = http.createServer(app.callback())

server.listen(port)
server.on('error', error => {
	if(error.syscall !== 'listen') {
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
