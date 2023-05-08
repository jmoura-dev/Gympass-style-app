import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsInsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CreateGymService } from './create-gym'

let gymsRepository: InMemoryGymsInsRepository
let sut: CreateGymService

describe('Create Gym Service', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsInsRepository()
    sut = new CreateGymService(gymsRepository)
  })

  it('should be able to gym', async () => {
    const { gym } = await sut.execute({
      name: 'TestName',
      latitude: -9.6678596,
      longitude: -35.7516062,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
