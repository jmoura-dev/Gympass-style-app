import { CheckIn, Prisma } from '@prisma/client'

export interface CheckInsRepository {
  findManyByUserId(userId: string, page: number): Promise<CheckIn[]>
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
  countByUserId(userId: string): Promise<number>
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>
}
