import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { UserCredentialsInvalid } from '@/services/errors/invalid-credentials-error'
import { makeGetUserProfileService } from '@/services/factories/make-get-user-profile'

export async function getUserProfile(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getProfileUserBodySchema = z.object({
    userId: z.string(),
  })

  const { userId } = getProfileUserBodySchema.parse(request.body)

  try {
    const getUserProfileService = makeGetUserProfileService()

    await getUserProfileService.execute({
      userId,
    })
  } catch (err) {
    if (err instanceof UserCredentialsInvalid) {
      return reply.status(400).send({ message: err.message })
    }

    throw err
  }

  return reply.status(200).send()
}
