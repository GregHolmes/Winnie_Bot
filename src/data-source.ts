import path from 'path'
import { ChainWar } from './models/chain-war'
import { ChallengeChannel } from './models/challenge-channel'
import { ChallengeController } from './models/challenge-controller'
import { ChallengeUser } from './models/challenge-user'
import { DataSource } from 'typeorm'
import { Goal } from './models/goal'
import { GuildConfig } from './models/guild-config'
import { PeriodConfig } from './models/period-config'
import { Race } from './models/race'
import { Raptor } from './models/raptor'
import { UserConfig } from './models/user-config'
import { War } from './models/war'
import 'reflect-metadata'

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.POSTGRES_CONNECTION_STRING,
  synchronize: false,
  logging: process.env.NODE_ENV !== 'production',
  entities: [
    ChainWar,
    ChallengeChannel,
    ChallengeController,
    ChallengeUser,
    Goal,
    GuildConfig,
    PeriodConfig,
    Race,
    Raptor,
    UserConfig,
    War
  ],
  migrations: [
    path.join(__dirname, '..', 'db', 'migration', '*.js')
  ],
  ssl: process.env.POSTGRES_SSL === 'true' ? { rejectUnauthorized: true } : false
})
