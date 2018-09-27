import Router from 'koa-router';

import indexController, { pageController } from '../controllers';
import apiController, { apiBaseController, getController } from '../controllers/api';

const router = Router();

router.get('/api/:controller/*', getController);
router.post('/api/:controller/*', apiController);
router.get('/api/*', apiBaseController);
router.get('/entry/:controller/:subPath', pageController);
router.get('*', indexController);

export default router
