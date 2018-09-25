import Router from 'koa-router'

import indexController from '../controllers'

const router = Router()

router.get('*', indexController)

export default router
