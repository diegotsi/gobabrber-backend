import { inject, injectable } from 'tsyringe'

// import AppError from '@shared/errors/AppError'

import IUsersRepository from '../repositories/IUserRepository'
import IUserTokenRepository from '../repositories/IUserTokenRepository'
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider'
import AppError from '@shared/errors/AppError'

// import User from '../infra/typeorm/entities/User'

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

    await this.userTokensRepository.generate(user.id)

    this.mailProvider.sendMail(email, 'Pedido de recuepração de senha recebido')
  }
}

export default SendForgotPasswordEmailService
