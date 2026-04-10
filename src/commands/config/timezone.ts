import { ApplicationCommandOptionType, ChatInputCommandInteraction } from 'discord.js'
import { GuildConfig, UserConfig } from '../../models'
import { I18n } from '../../core'
import { IANAZone } from 'luxon'
import { SubCommand } from '../../types'

const NAME = 'timezone'

export const ConfigTimezoneCommand: SubCommand = {
  name: NAME,
  commandData: async (locale: string) => ({
    name: NAME,
    description: await I18n.translate(locale, 'commands:config.timezone.description'),
    type: ApplicationCommandOptionType.SubcommandGroup,
    options: [
      {
        name: 'get',
        description: await I18n.translate(locale, 'commands:config.timezone.get.description'),
        type: ApplicationCommandOptionType.Subcommand
      },
      {
        name: 'reset',
        description: await I18n.translate(locale, 'commands:config.timezone.reset.description'),
        type: ApplicationCommandOptionType.Subcommand
      },
      {
        name: 'set',
        description: await I18n.translate(locale, 'commands:config.timezone.set.description'),
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: 'timezone',
            description: await I18n.translate(locale, 'commands:config.timezone.set.args.timezone'),
            type: ApplicationCommandOptionType.String,
            required: true
          }
        ]
      }
    ]
  }),

  execute: async (interaction: ChatInputCommandInteraction, guildConfig: GuildConfig, userConfig: UserConfig) => {
    const subcommand = interaction.options.getSubcommand()
    if (subcommand == null) { return }

    switch (subcommand) {
      case 'get':
        await get(interaction, guildConfig, userConfig)
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

async function get (interaction: ChatInputCommandInteraction, guildConfig: GuildConfig, userConfig: UserConfig): Promise<void> {
  if (userConfig.timezone == null) {
    await interaction.reply(await I18n.translate(guildConfig.locale, 'commands:config.timezone.get.error.notSet'))
  } else {
    await interaction.reply(await I18n.translate(guildConfig.locale, 'commands:config.timezone.get.success', {
      timezone: userConfig.timezone.name
    }))
  }
}

async function reset (interaction: ChatInputCommandInteraction, guildConfig: GuildConfig): Promise<void> {
  const userConfig = await UserConfig.findOrCreate(interaction.user.id)
  userConfig.timezone = null
  await userConfig.save()

  if (userConfig.errors.length > 0) {
    await interaction.reply(await I18n.translate(guildConfig.locale, 'commands:config.timezone.reset.error'))
  } else {
    await interaction.reply(await I18n.translate(guildConfig.locale, 'commands:config.timezone.reset.success'))
  }
}

async function set (interaction: ChatInputCommandInteraction, guildConfig: GuildConfig): Promise<void> {
  const userConfig = await UserConfig.findOrCreate(interaction.user.id)
  const timezone = interaction.options.getString('timezone', true)

  userConfig.timezone = new IANAZone(timezone)
  await userConfig.save()

  if (userConfig.errors.length > 0) {
    await interaction.reply(await I18n.translate(guildConfig.locale, 'commands:config.timezone.set.error.invalidValue'))
  } else {
    await interaction.reply(await I18n.translate(guildConfig.locale, 'commands:config.timezone.set.success', {
      timezone: userConfig.timezone.name
    }))
  }
}
