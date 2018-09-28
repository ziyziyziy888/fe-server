// import MCServer from '@mc/fe-server';
import MCServer from '../../index.js';  // 需要手动开启
import config from 'config';

import userDefined from './middlewares/user-defined.js';
import routers from './middlewares/routers.js';
console.log(process.env.NODE_ENV);

MCServer(config)
  .load(userDefined)
  .loadDefault()
  .load(routers.routes())
  .start();
