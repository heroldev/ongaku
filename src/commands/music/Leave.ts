import { Queue } from "@datastructures-js/queue";
import { getVoiceConnection, VoiceConnectionReadyState } from "@discordjs/voice";
import { BaseCommandInteraction, Client, Guild, MessageEmbed } from "discord.js";
import { Command } from "../../types/Command";
import { ServerQueue } from "../../util/ServerQueue";

export const Leave: Command = {
  name: "leave",
  description: "closes the current voice connection, if one is active",
  type: "CHAT_INPUT",
  run: async (client: Client, interaction: BaseCommandInteraction) => {

    const embed = new MessageEmbed()

    const guild: Guild = client.guilds.cache.get(interaction.guildId as string) as Guild; // Getting the guild.

    const connection = getVoiceConnection(guild.id)

    if (connection !== undefined) {
      const state = connection.state as VoiceConnectionReadyState
      state.subscription!.player.stop()
      ServerQueue.delete(interaction.guildId as string)
      connection!.destroy()

      embed.setColor('#efc8c2')
        .setTitle('goodbye!')
    } else {
      embed.setColor('#efc8c2')
        .setTitle('not connected!')
        .setDescription('musebert is not currently connected to a voice channel.')
    }

    await interaction.followUp({
      ephemeral: true,
      embeds: [embed]
    });
  }
};