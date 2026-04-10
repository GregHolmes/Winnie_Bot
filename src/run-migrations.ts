import { AppDataSource } from './data-source'

AppDataSource.initialize()
  .then(async () => {
    console.log('Running migrations...')
    await AppDataSource.runMigrations()
    console.log('Migrations completed successfully.')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Migration failed:', error)
    process.exit(1)
  })
