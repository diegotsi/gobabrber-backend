import { inject, injectable } from 'tsyringe'

import IUsersRepository from '../repositories/IUserRepository'
import IUserTokenRepository from '../repositories/IUserTokenRepository'
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider'
import AppError from '@shared/errors/AppError'

interface IRequest {
  email: string
}

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokenRepository
  ) {}
  public async execute({ email }: IRequest): Promise<void> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new AppError('User does not exist')
    }

    const { token } = await this.userTokensRepository.generate(user.id)

    await this.mailProvider.sendMail(
      email,
      `Pedido de recuepração de senha recebido: ${token}`
    )
  }
}

export default SendForgotPasswordEmailService
