import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsInsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsService } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsInsRepository
let sut: FetchNearbyGymsService

describe('Fetch Nearby Gyms Service', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsInsRepository()
    sut = new FetchNearbyGymsService(gymsRepository)
  })

  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      name: 'Near Gym',
      latitude: -9.6678596,
      longitude: -35.7516062,
    })

    await gymsRepository.create({
      name: 'Far Gym',
      latitude: -9.5337583,
      longitude: -35.7171013,
    })

    const { gyms } = await sut.execute({
      userLatitude: -9.6678596,
      userLongitude: -35.7516062,
    })

    expect(1).toEqual(gyms.length)
    expect(gyms).toEqual([expect.objectContaining({ name: 'Near Gym' })])
  })

  // it('should be able to fetch paginated gyms search', async () => {
  //   for (let i = 1; i <= 22; i++) {
  //     await gymsRepository.create({
  //       name: `JavaScript Gym-${i}`,
  //       latitude: -9.6678596,
  //       longitude: -35.7516062,
  //     })
  //   }

  //   const { gyms } = await sut.execute({
  //     query: 'JavaScript',
  //     page: 2,
  //   })

  //   expect(gyms).toHaveLength(2)
  //   expect(gyms).toEqual([
  //     expect.objectContaining({ name: 'JavaScript Gym-21' }),
  //     expect.objectContaining({ name: 'JavaScript Gym-22' }),
  //   ])
  // })
})
