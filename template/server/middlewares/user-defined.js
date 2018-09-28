// 自定义中间件
export default async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`User defined log: ${ctx.method} ${ctx.url} - ${ms}ms`)
}
