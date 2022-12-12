import { Queue } from "@datastructures-js/queue";
import { getVoiceConnection, VoiceConnectionReadyState } from "@discordjs/voice";
import { BaseCommandInteraction, Client, Guild, MessageEmbed } from "discord.js";
import { Command } from "../../types/Command";
import { Song } from "../../types/Song";
import { ServerQueue } from "../../util/ServerQueue";

export const Clear: Command = {
  name: "clear",
  description: "clears the queue, but keeps the player going",
  type: "CHAT_INPUT",
  run: async (client: Client, interaction: BaseCommandInteraction) => {

    const embed = new MessageEmbed()

    const guild: Guild = client.guilds.cache.get(interaction.guildId as string) as Guild; // Getting the guild.

    if (!ServerQueue.get(guild.id)) {
      embed.setColor('#efc8c2')
        .setTitle('clear failed!')
        .setDescription('no audio is currently playing.')
      await interaction.followUp({
        ephemeral: true,
        embeds: [embed]
      });
    }

    const connection = getVoiceConnection(guild.id)

    if (connection !== undefined) {
      const state = connection.state as VoiceConnectionReadyState
      let playingSong = ServerQueue.get(guild.id)?.front()!

      ServerQueue.set(guild.id, new Queue<Song>([playingSong]))

      embed.setColor('#efc8c2')
        .setTitle('queue cleared!')
        .setFooter({ text: `use \`/stop\` to stop playback altogether` })
    }

    await interaction.followUp({
      ephemeral: true,
      embeds: [embed]
    });
  }
};