import { ApplicationCommandOptionType, ChatInputCommandInteraction } from 'discord.js'
import { GuildConfig } from '../../models'
import { I18n } from '../../core'
import { SubCommand } from '../../types'

const NAME = 'announcements_channel'

export const ServerAnnouncementsChannelCommand: SubCommand = {
  name: NAME,
  commandData: async (locale: string) => ({
    name: NAME,
    description: await I18n.translate(locale, 'commands:server.announcementsChannel.description'),
    type: ApplicationCommandOptionType.SubcommandGroup,
    options: [
      {
        name: 'get',
        description: await I18n.translate(locale, 'commands:server.announcementsChannel.get.description'),
        type: ApplicationCommandOptionType.Subcommand
      },
      {
        name: 'reset',
        description: await I18n.translate(locale, 'commands:server.announcementsChannel.reset.description'),
        type: ApplicationCommandOptionType.Subcommand
      },
      {
        name: 'set',
        description: await I18n.translate(locale, 'commands:server.announcementsChannel.set.description'),
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: 'announcements_channel',
            description: await I18n.translate(locale, 'commands:server.announcementsChannel.set.args.announcementsChannel'),
            type: ApplicationCommandOptionType.Channel,
            required: true
          }
        ]
      }
    ]
  }),

  execute: async (interaction: ChatInputCommandInteraction, guildConfig: GuildConfig) => {
    const subcommand = interaction.options.getSubcommand()
    if (subcommand == null) { return }

    switch (subcommand) {
      case 'get':
        await get(interaction, guildConfig)
        break
      case 'reset':
        await reset(interaction, guildConfig)
        break
      case 'set':
        await set(interaction, guildConfig)
        break
    }
  }
}

async function get (interaction: ChatInputCommandInteraction, guildConfig: GuildConfig): Promise<void> {
  if (guildConfig.announcementsChannelId == null) {
    await interaction.reply(await I18n.translate(guildConfig.locale, 'commands:server.announcementsChannel.get.error.notSet'))
  } else {
    await interaction.reply(await I18n.translate(guildConfig.locale, 'commands:server.announcementsChannel.get.success', {
      announcementsChannel: guildConfig.announcementsChannelId
    }))
  }
}

async function reset (interaction: ChatInputCommandInteraction, guildConfig: GuildConfig): Promise<void> {
  guildConfig.announcementsChannelId = null
  await guildConfig.save()

  if (guildConfig.errors.length > 0) {
    await interaction.reply(await I18n.translate(guildConfig.locale, 'commands:server.announcementsChannel.reset.error'))
  } else {
    await interaction.reply(await I18n.translate(guildConfig.locale, 'commands:server.announcementsChannel.reset.success'))
  }
}

async function set (interaction: ChatInputCommandInteraction, guildConfig: GuildConfig): Promise<void> {
  const announcementsChannel = interaction.options.getChannel('announcements_channel', true).id
  guildConfig.announcementsChannelId = announcementsChannel
  await guildConfig.save()

  if (guildConfig.errors.length > 0) {
    await interaction.reply(await I18n.translate(guildConfig.locale, 'commands:server.announcementsChannel.set.error'))
  } else {
    await interaction.reply(await I18n.translate(guildConfig.locale, 'commands:server.announcementsChannel.set.success', {
      announcementsChannel: guildConfig.announcementsChannelId
    }))
  }
}
