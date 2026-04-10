import { BaseModel } from './bases/base-model'
import { ChallengeController } from './challenge-controller'
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { IsChannelWithPermission } from './validators/channel-with-permission'
import { MaxLength, ValidateIf } from 'class-validator'
import { PermissionFlagsBits, Snowflake } from 'discord.js'
import { WinnieClient } from '../core'

/**
 * Represents a channel joined to a challenge.
 */
@Entity({ name: 'challenge_channels' })
export class ChallengeChannel extends BaseModel {
  @PrimaryColumn({ name: 'challenge_id' })
  challengeId!: number

  /**
   * The challenge controller
   */
  @ManyToOne(() => ChallengeController, challengeController => challengeController.channels)
  @JoinColumn({ name: 'challenge_id' })
  challengeController!: ChallengeController

  /**
   * The channel's discord Id
   */
  @PrimaryColumn({ name: 'channel_id' })
  @ValidateIf(() => WinnieClient.isLoggedIn())
  @IsChannelWithPermission(PermissionFlagsBits.SendMessages)
  @MaxLength(30)
  channelId!: Snowflake
}
