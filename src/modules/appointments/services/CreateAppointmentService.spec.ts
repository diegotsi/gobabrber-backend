import AppError from '@shared/errors/AppError'

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository'
import CreateAppointmentService from './CreateAppointmentService'

import FakeNotificationRepository from '@modules/notifications/repositories/fakes/FakeNotificationRepository'

let fakeAppoointmentRepository: FakeAppointmentsRepository
let createAppointment: CreateAppointmentService
let fakeNotificationRepository: FakeNotificationRepository

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppoointmentRepository = new FakeAppointmentsRepository()
    fakeNotificationRepository = new FakeNotificationRepository()

    createAppointment = new CreateAppointmentService(
      fakeAppoointmentRepository,
      fakeNotificationRepository
    )
  })

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime()
    })

    const appointment = await createAppointment.execute({
      date: new Date(2020, 4, 10, 13),
      provider_id: 'provider-id',
      user_id: 'user-id',
    })

    expect(appointment).toHaveProperty('id')
    expect(appointment.provider_id).toBe('provider-id')
  })

  it('should not be able to create a new appointment on the same time', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 5, 10, 12).getTime()
    })

    await createAppointment.execute({
      date: new Date(2020, 5, 10, 16),
      provider_id: 'provider-id',
      user_id: 'user-id',
    })

    await expect(
      createAppointment.execute({
        date: new Date(2020, 5, 10, 16),
        provider_id: 'provider-id',
        user_id: 'user-id',
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to create an appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime()
    })

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 11),
        provider_id: 'provider-id',
        user_id: 'user-id',
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to create an appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime()
    })

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 11),
        provider_id: 'provider-id',
        user_id: 'provider-id',
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to create an appointment before 8am and after 5pm', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime()
    })

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 11, 7),
        provider_id: 'provider-id',
        user_id: 'user-id',
      })
    ).rejects.toBeInstanceOf(AppError)
    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 11, 18),
        provider_id: 'provider-id',
        user_id: 'user-id',
      })
    ).rejects.toBeInstanceOf(AppError)
  })
})
