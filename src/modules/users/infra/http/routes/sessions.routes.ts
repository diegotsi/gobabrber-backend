import { Router } from 'express'

import SessionsController from '../controllers/SessionsController'

const sessionsRouter = Router()
const sessionscontroller = new SessionsController()

sessionsRouter.post('/', sessionscontroller.create)

export default sessionsRouter
