import Router from 'koa-router';

import indexController from '../controllers';
import apiController, { apiBaseController } from '../controllers/api';

const router = Router();

router.get('/api/:controller/*', apiController);
router.get('/api/*', apiBaseController);
router.get('*', indexController);

export default router
