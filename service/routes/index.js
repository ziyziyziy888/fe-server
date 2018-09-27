const Router = require('koa-router');

const indexController = require('../controllers');
const apiController = require( '../controllers/api');

const router = Router();

router.get('/api/:controller/*', apiController.getController);
router.post('/api/:controller/*', apiController.defaultController);
router.get('/api/*', apiController.apiBaseController);
router.get('/entry/:controller/:subPath', indexController.pageController);
router.get('*', indexController.defaultController);

module.exports = router
