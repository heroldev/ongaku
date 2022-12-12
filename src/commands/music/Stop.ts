import { Queue } from "@datastructures-js/queue";
import { getVoiceConnection, VoiceConnectionReadyState } from "@discordjs/voice";
import { BaseCommandInteraction, Client, Guild, MessageEmbed } from "discord.js";
import { Command } from "../../types/Command";
import { Song } from "../../types/Song";
import { ServerQueue } from "../../util/ServerQueue";

export const Stop: Command = {
  name: "stop",
  description: "stop the player and clear the queue",
  type: "CHAT_INPUT",
  run: async (client: Client, interaction: BaseCommandInteraction) => {

    const embed = new MessageEmbed()

    const guild: Guild = client.guilds.cache.get(interaction.guildId as string) as Guild; // Getting the guild.

    if (!ServerQueue.get(guild.id)) {
      embed.setColor('#efc8c2')
        .setTitle('stop failed!')
        .setDescription('no audio is currently playing.')
      await interaction.followUp({
        ephemeral: true,
        embeds: [embed]
      });
      return
    }

    const connection = getVoiceConnection(guild.id)

    if (connection !== undefined) {
      const state = connection.state as VoiceConnectionReadyState
      ServerQueue.set(guild.id, new Queue<Song>())
      state.subscription!.player.stop()

      embed.setColor('#efc8c2')
        .setTitle('player stopped!')
    }

    await interaction.followUp({
      ephemeral: true,
      embeds: [embed]
    });
  }
};