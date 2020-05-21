import AppError from '@shared/errors/AppError'

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'

import AuthenticateUserService from './AuthenticateUserService'
import CreateUserService from './CreateUserService'

let fakeUsersRepository: FakeUsersRepository
let fakeHashProvider: FakeHashProvider
let createUser: CreateUserService
let authenticatedUser: AuthenticateUserService

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeHashProvider = new FakeHashProvider()
    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider)

    authenticatedUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider
    )
  })

  it('should be able to authenticate', async () => {
    const user = await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const response = await authenticatedUser.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(response).toHaveProperty('token')
    expect(response.user).toEqual(user)
  })

  it('should not be able to authenticate with non existent user', async () => {
    await expect(
      authenticatedUser.execute({
        email: 'johndoe@example.com',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    await expect(
      authenticatedUser.execute({
        email: 'johndoe@example.com',
        password: '12345678',
      })
    ).rejects.toBeInstanceOf(AppError)
  })
})
