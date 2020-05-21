import AppError from '@shared/errors/AppError'

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import FakeUserTokenRepository from '../repositories/fakes/FakeUserTokenRepository'

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'
import ResetPasswordService from './ResetPasswordService'

let fakeUsersRepository: FakeUsersRepository
let fakeUserTokenRepository: FakeUserTokenRepository
let resetPasswordService: ResetPasswordService
let fakeHashProvider: FakeHashProvider

describe('ResetPasswordService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeUserTokenRepository = new FakeUserTokenRepository()
    fakeHashProvider = new FakeHashProvider()

    resetPasswordService = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokenRepository,
      fakeHashProvider
    )
  })

  it('should be able to reset the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const { token } = await fakeUserTokenRepository.generate(user.id)

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash')

    await resetPasswordService.execute({
      password: '123123',
      token,
    })

    const updatedUser = await fakeUsersRepository.findById(user.id)

    expect(generateHash).toHaveBeenCalledWith('123123')
    expect(updatedUser?.password).toBe('123123')
  })

  it('shoult not be able to reset password with non existing token', async () => {
    await expect(
      resetPasswordService.execute({
        password: '123123',
        token: 'non-existing-token',
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('shoult not be able to reset password with non existing user', async () => {
    const { token } = await fakeUserTokenRepository.generate(
      'non-existing-user'
    )

    await expect(
      resetPasswordService.execute({
        password: '123123',
        token,
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to reset password if passed more than 2 hours', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    jest.spyOn(Date, 'now').mockImplementation(() => {
      const customDate = new Date()

      return customDate.setHours(customDate.getHours() + 3)
    })

    const { token } = await fakeUserTokenRepository.generate(user.id)

    await expect(
      resetPasswordService.execute({
        password: '123123',
        token,
      })
    ).rejects.toBeInstanceOf(AppError)
  })
})
