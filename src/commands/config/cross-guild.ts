import { ApplicationCommandOptionType, ChatInputCommandInteraction } from 'discord.js'
import { GuildConfig, UserConfig } from '../../models'
import { I18n } from '../../core'
import { SubCommand } from '../../types'

const NAME = 'cross_guild'

export const ConfigCrossGuildCommand: SubCommand = {
  name: NAME,
  commandData: async (locale: string) => ({
    name: NAME,
    description: await I18n.translate(locale, 'commands:config.crossGuild.description'),
    type: ApplicationCommandOptionType.SubcommandGroup,
    options: [
      {
        name: 'get',
        description: await I18n.translate(locale, 'commands:config.crossGuild.get.description'),
        type: ApplicationCommandOptionType.Subcommand
      },
      {
        name: 'reset',
        description: await I18n.translate(locale, 'commands:config.crossGuild.reset.description'),
        type: ApplicationCommandOptionType.Subcommand
      },
      {
        name: 'set',
        description: await I18n.translate(locale, 'commands:config.crossGuild.set.description'),
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: 'enabled',
            description: await I18n.translate(locale, 'commands:config.crossGuild.set.args.enabled'),
            type: ApplicationCommandOptionType.Boolean,
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
  const key = userConfig.crossGuild ? 'enabled' : 'disabled'

  await interaction.reply(await I18n.translate(guildConfig.locale, `commands:config.crossGuild.get.${key}`))
}

async function reset (interaction: ChatInputCommandInteraction, guildConfig: GuildConfig): Promise<void> {
  const userConfig = await UserConfig.findOrCreate(interaction.user.id)
  userConfig.crossGuild = true
  await userConfig.save()

  if (userConfig.errors.length > 0) {
    await interaction.reply(await I18n.translate(guildConfig.locale, 'commands:config.crossGuild.reset.error'))
  } else {
    await interaction.reply(await I18n.translate(guildConfig.locale, 'commands:config.crossGuild.reset.success'))
  }
}

async function set (interaction: ChatInputCommandInteraction, guildConfig: GuildConfig): Promise<void> {
  const userConfig = await UserConfig.findOrCreate(interaction.user.id)
  userConfig.crossGuild = interaction.options.getBoolean('enabled', true)
  await userConfig.save()

  if (userConfig.errors.length > 0) {
    await interaction.reply(await I18n.translate(guildConfig.locale, 'commands:config.crossGuild.set.error'))
  } else {
    if (userConfig.crossGuild) {
      await interaction.reply(await I18n.translate(guildConfig.locale, 'commands:config.crossGuild.set.enabled'))
    } else {
      await interaction.reply(await I18n.translate(guildConfig.locale, 'commands:config.crossGuild.set.disabled'))
    }
  }
}
