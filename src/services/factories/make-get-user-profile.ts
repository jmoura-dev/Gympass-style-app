import { GetUserProfileService } from '../get-user-profile'
import { PrismaUserRepository } from '@/repositories/prisma/prisma-users-repository'

export function makeGetUserProfileService() {
  const usersRepository = new PrismaUserRepository()
  const service = new GetUserProfileService(usersRepository)

  return service
}
