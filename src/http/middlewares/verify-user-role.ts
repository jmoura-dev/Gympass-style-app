import { FastifyRequest, FastifyReply } from 'fastify'

export function verifyUserRole(verifyRole: 'ADMIN' | 'MEMBER') {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const { role } = request.user

    if (role !== verifyRole) {
      return reply.status(401).send({ message: 'Unauthorized.' })
    }
  }
}
