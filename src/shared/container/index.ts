import { container } from 'tsyringe'

import '@modules/users/providers'
import './providers'

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository'
import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository'

import IUserRepository from '@modules/users/repositories/IUserRepository'
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository'

// import IUserTokenRepository from '@modules/users/repositories/IUserTokenRepository'

container.registerSingleton<IAppointmentsRepository>(
  'AppointmentsRepository',
  AppointmentsRepository
)

container.registerSingleton<IUserRepository>('UsersRepository', UsersRepository)
