import request from 'supertest'
import { app } from '@/app'

import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/services/utils/create-and-authenticate-user'

describe('Nearby Gyms e2e', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to list nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'JavaScript Gym',
        description: 'Some description',
        phone: '3213123123',
        latitude: -9.6678596,
        longitude: -35.7516062,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'React Gym',
        description: 'Some description',
        phone: '3213123123',
        latitude: -9.5337583,
        longitude: -35.7171013,
      })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -9.6678596,
        longitude: -35.7516062,
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        name: 'JavaScript Gym',
      }),
    ])
  })
})
