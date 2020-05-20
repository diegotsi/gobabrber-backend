import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository'
import CreateAppointmentService from './CreateAppointmentService'

describe('CreateAppointment', () => {
  it('should be able to create a new appointment', async () => {
    const fakeAppoointmentRepository = new FakeAppointmentsRepository()

    const createAppointment = new CreateAppointmentService(
      fakeAppoointmentRepository
    )

    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: '123123123',
    })

    expect(appointment).toHaveProperty('id')
    expect(appointment.provider_id).toBe('123123123')
  })
})
