import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { UserCredentialsInvalid } from '@/services/errors/invalid-credentials-error'
import { makeAuthenticateService } from '@/services/factories/make-authenticate-service'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateBodySchema.parse(request.body)

  try {
    const authenticateService = makeAuthenticateService()

    await authenticateService.execute({
      email,
      password,
    })
  } catch (err) {
    if (err instanceof UserCredentialsInvalid) {
      return reply.status(400).send({ message: err.message })
    }

    throw err
  }

  return reply.status(200).send({ email, password })
}
