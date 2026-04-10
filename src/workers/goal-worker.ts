import { AppDataSource } from '../data-source'
import { BaseWorker } from './base-worker'
import { JobQueue } from '../core'
import { Jobs } from '../jobs'

AppDataSource.initialize().then(() => {
  const worker = new BaseWorker(JobQueue.queueNames.goals, Jobs.goalJobs.all)
  process.on('SIGTERM', () => worker.gracefulShutdown())
  process.on('SIGINT', () => worker.gracefulShutdown())
}).catch(() => {})
