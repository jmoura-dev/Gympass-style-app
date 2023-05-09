import { RegisterService } from '../register'
import { PrismaUserRepository } from '@/repositories/prisma/prisma-users-repository'

export function makeRegisterService() {
  const usersRepository = new PrismaUserRepository()
  const service = new RegisterService(usersRepository)

  return service
}
