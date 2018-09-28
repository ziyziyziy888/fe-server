import Router from 'koa-router';

import indexController, { pageController } from '../controllers/index';

const router = Router();

router.get('/entry/:controller/:subPath', pageController);
router.get('*', indexController);

export default router;
