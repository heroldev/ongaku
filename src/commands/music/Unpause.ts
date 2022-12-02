import { getVoiceConnection, VoiceConnectionReadyState } from "@discordjs/voice";
import { BaseCommandInteraction, Client, Guild, MessageEmbed } from "discord.js";
import { Command } from "../../types/Command";

export const Unpause: Command = {
  name: "unpause",
  description: "unpauses the player",
  type: "CHAT_INPUT",
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    const embed = new MessageEmbed()
      .setColor('#d5eee1')
      .setTitle('pause failed!')
      .setDescription('no audio is currently playing.')

    const guild: Guild = client.guilds.cache.get(interaction.guildId as string) as Guild; // Getting the guild.

    const connection = getVoiceConnection(guild.id)

    if (connection !== undefined) {
      const state = connection.state as VoiceConnectionReadyState
      state.subscription!.player.unpause()

      embed.setColor('#d5eee1')
        .setTitle('video unpaused!')
        .setDescription('use `/pause` to pause video playback')
    }

    await interaction.followUp({
      ephemeral: true,
      embeds: [embed]
    });
  }
};