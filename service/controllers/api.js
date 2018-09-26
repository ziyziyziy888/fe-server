export default async (ctx, next) => {
  ctx.body= {
    data: ctx
  }
  return;
	await ctx.render('index', {
		title: 'api test'
	})
}

export const apiBaseController = async (ctx, next) => {
  ctx.body = {
    data: 'api base'
  }
}
