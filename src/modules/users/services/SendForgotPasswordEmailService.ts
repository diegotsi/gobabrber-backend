import { inject, injectable } from 'tsyringe'
import path from 'path'

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

    const forgorPasswordTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'forgot_password.pug'
    )

    await this.mailProvider.sendMail({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: '[GoBarber] Recuperação de senha',
      templateData: {
        file: forgorPasswordTemplate,
        variables: {
          name: user.name,
          link: `http://loclahost:3000/reset_password?token=${token}`,
        },
      },
    })
  }
}

export default SendForgotPasswordEmailService
