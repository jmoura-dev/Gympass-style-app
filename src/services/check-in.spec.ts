import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInService } from './check-in'
import { InMemoryGymsInsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsInsRepository
let sut: CheckInService

describe('Check-in Service', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsInsRepository()
    sut = new CheckInService(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      name: 'Javascript Gym',
      description: '',
      phone: '',
      latitude: -9.6678596,
      longitude: -35.7516062,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -9.6678596,
      userLongitude: -35.7516062,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 6, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -9.6678596,
      userLongitude: -35.7516062,
    })

    expect(async () => {
      await sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -9.6678596,
        userLongitude: -35.7516062,
      })
    }).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice but in different day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 6, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -9.6678596,
      userLongitude: -35.7516062,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 6, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -9.6678596,
      userLongitude: -35.7516062,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      name: 'Javascript Gym',
      description: '',
      latitude: new Decimal(-9.6387519),
      longitude: new Decimal(-35.7178318),
      phone: '',
    })

    expect(async () => {
      await sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -9.6678596,
        userLongitude: -35.7516062,
      })
    }).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
