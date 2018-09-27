import config from 'config';

import staticAddress from '../../pack/address.json';

export default async (ctx, next) => {
  console.log(ctx);
	await ctx.render('index', {
    title: config['domain'],
    jsList: [],
    cssList: []
	});
}

export const pageController = async (ctx, next) => {
  if (staticAddress[ctx.params.controller]) {
    let staticList = staticAddress[ctx.params.controller];
    await ctx.render('index', {
      title: config['domain'],
      jsList: staticList.js,
      cssList: staticList.css
    });
  } else {
    ctx.body= {
      data: {
        info: ctx,
        title: '未找到对应自定义服务'
      },
      ret: 0
    }
  }
}
