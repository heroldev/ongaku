import { getVoiceConnection, VoiceConnectionReadyState, VoiceConnectionState } from "@discordjs/voice";
import { BaseCommandInteraction, Client, Guild, MessageEmbed } from "discord.js";
import { Command } from "../../types/Command";

export const Pause: Command = {
  name: "pause",
  description: "pauses the currently playing video, if there is one",
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
      state.subscription!.player.pause()

      embed.setColor('#d5eee1')
      .setTitle('video paused!')
      .setDescription('use `/unpause` to resume video playback')
    }

    await interaction.followUp({
      ephemeral: true,
      embeds: [embed]
    });
  }
};