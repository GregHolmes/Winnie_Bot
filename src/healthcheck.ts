import { AppDataSource } from './data-source'

async function healthcheck (): Promise<void> {
  try {
    await AppDataSource.initialize()
    await AppDataSource.query('SELECT 1')
    await AppDataSource.destroy()
    process.exit(0)
  } catch {
    process.exit(1)
  }
}

healthcheck()
