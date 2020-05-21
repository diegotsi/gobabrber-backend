import { Router } from 'express'

import ensureAuthenticated from '../middleware/ensureAuthenticated'
import ProfileController from '../controllers/ProfileController'

const profileRouter = Router()
const profileController = new ProfileController()

profileRouter.use(ensureAuthenticated)

profileRouter.put('/', profileController.update)
profileRouter.get('/', profileController.show)

export default profileRouter
