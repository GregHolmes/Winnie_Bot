import IORedis from 'ioredis'
import { Queue } from 'bullmq'

export const redisConnection = new IORedis({
  host: process.env.REDIS_HOST ?? 'localhost',
  port: process.env.REDIS_PORT != null ? parseInt(process.env.REDIS_PORT) : 6379,
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null
})

export const queueNames = {
  goals: 'goals_queue'
}

const goalsQueue = new Queue(queueNames.goals, {
  connection: redisConnection
})

export const JobQueue = {
  queues: {
    goalsQueue
  },
  queueNames,
  connection: redisConnection
}
