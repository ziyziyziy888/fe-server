import request from 'request';
import apiController from '../app/index.js';

// 对经过这边的api进行分发
export default async (ctx, next) => {
  if (apiController[ctx.params.controller]) {
    ctx.body = await apiController[ctx.params.controller](ctx);
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

export const apiBaseController = async (ctx, next) => {
  ctx.body = {
    data: 'api base'
  }
}

export const getController = async (ctx, next) => {
  ctx.body = {
    data: 'api只能通过post方式调用',
    ret: 0
  }
}
