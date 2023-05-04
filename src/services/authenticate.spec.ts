import { expect, describe, it, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateService } from './authenticate'
import { UserCredentialsInvalid } from './errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateService

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateService(usersRepository)
  })

  it('should be able to authenticate', async () => {
    await usersRepository.create({
      name: 'Fulano',
      email: 'fulano@email.com',
      password_hash: await hash('123456', 6),
    })

    const email = 'fulano@email.com'
    const password = '123456'

    const { user } = await sut.execute({
      email,
      password,
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'fulano@email.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserCredentialsInvalid)
  })

  it('should not be able to authenticate with wrong password', async () => {
    await usersRepository.create({
      name: 'Fulano',
      email: 'fulano@email.com',
      password_hash: await hash('123456', 6),
    })

    await expect(() =>
      sut.execute({
        email: 'fulano@email.com',
        password: '1232456',
      }),
    ).rejects.toBeInstanceOf(UserCredentialsInvalid)
  })
})
