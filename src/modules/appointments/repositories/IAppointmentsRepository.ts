import Appointment from '../infra/typeorm/entities/Appointment'
import ICreateAppointmentDTO from '../dtos/ICreateAppointmentDTO'
import IFindAllInMonthProviderDTO from '../dtos/IFindAllInMonthProviderDTO'
import IFindAllInDayProviderDTO from '../dtos/IFindAllInDayProviderDTO'
interface IAppointmentsRepository {
  create(data: ICreateAppointmentDTO): Promise<Appointment>
  findByDate(date: Date): Promise<Appointment | undefined>
  findAllInMonthFromProvider(
    data: IFindAllInMonthProviderDTO
  ): Promise<Appointment[]>
  findAllInDayFromProvider(
    data: IFindAllInDayProviderDTO
  ): Promise<Appointment[]>
}

export default IAppointmentsRepository
