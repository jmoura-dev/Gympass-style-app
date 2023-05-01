import fastify from 'fastify'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

prisma.user.create({
  data: {
    name: 'Jackson Moura',
    email: 'jackson@email.com',
  },
})

export const app = fastify()
