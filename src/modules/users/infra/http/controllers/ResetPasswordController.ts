import { Request, Response } from 'express'
import { container } from 'tsyringe'

import ResetPasswordService from '@modules/users/services/ResetPasswordService'

export default class ResetPasswordController {
  public async create(request: Request, response: Response): Promise<Response> {
    try {
      const { password, token } = request.body

      const resetPassword = container.resolve(ResetPasswordService)

      await resetPassword.execute({
        password,
        token,
      })

      return response.status(204).json()
    } catch (err) {
      return response.status(400).json({ message: err.message })
    }
  }
}
