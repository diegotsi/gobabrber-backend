import { startOfHour, isBefore, getHours, format } from 'date-fns'
import { injectable, inject } from 'tsyringe'

import AppError from '@shared/errors/AppError'

import Appointment from '../infra/typeorm/entities/Appointment'

import IAppointmentsRepository from '../repositories/IAppointmentsRepository'
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository'

interface IRequest {
  user_id: string
  provider_id: string
  date: Date
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository
  ) {}

  public async execute({
    date,
    provider_id,
    user_id,
  }: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date)

    if (user_id === provider_id) {
      throw new AppError('You can`t creat an appointment with yourself')
    }

    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError('You can`t creat an appointment on past date')
    }

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError('You can only create appointment between 8am and 5pm')
    }

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate
    )

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked!')
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentDate,
    })

    const dateFormatted = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm")

    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento para dia ${dateFormatted}`,
    })

    return appointment
  }
}

export default CreateAppointmentService
