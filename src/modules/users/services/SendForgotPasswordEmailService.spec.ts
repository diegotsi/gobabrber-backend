import AppError from '@shared/errors/AppError'

import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider'
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import FakeUserTokenRepository from '../repositories/fakes/FakeUserTokenRepository'
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService'

let fakeUsersRepository: FakeUsersRepository
let fakeMailProvider: FakeMailProvider
let fakeUserTokenRepository: FakeUserTokenRepository
let sendForgotPasswordEmail: SendForgotPasswordEmailService

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeUserTokenRepository = new FakeUserTokenRepository()
    fakeMailProvider = new FakeMailProvider()

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokenRepository
    )
  })

  it('should be able to recover the password using the email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail')

    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    await sendForgotPasswordEmail.execute({
      email: 'johndoe@example.com',
    })

    expect(sendMail).toHaveBeenCalled()
  })

  it('should not be able to recover a non existing user password', async () => {
    await expect(
      sendForgotPasswordEmail.execute({
        email: 'johndoe@example.com',
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should be able to recover the password using the email', async () => {
    const generateToken = jest.spyOn(fakeUserTokenRepository, 'generate')

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    await sendForgotPasswordEmail.execute({
      email: 'johndoe@example.com',
    })

    expect(generateToken).toHaveBeenCalledWith(user.id)
  })
})
