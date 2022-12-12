import { getVoiceConnection, VoiceConnectionReadyState } from "@discordjs/voice";
import { BaseCommandInteraction, Client, Guild, MessageEmbed } from "discord.js";
import { Command } from "../../types/Command";
import { ServerQueue } from "../../util/ServerQueue";

export const Skip: Command = {
  name: "skip",
  description: "skips the currently playing song",
  type: "CHAT_INPUT",
  run: async (client: Client, interaction: BaseCommandInteraction) => {

    const embed = new MessageEmbed()

    const guild: Guild = client.guilds.cache.get(interaction.guildId as string) as Guild; // Getting the guild.

    if (!ServerQueue.get(guild.id)) {
      embed.setColor('#efc8c2')
        .setTitle('skip failed!')
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
      state.subscription!.player.stop()

      embed.setColor('#efc8c2')
        .setTitle('video skipped!')
        .setFooter({ text: `use \`/queue\` to view upcoming videos` })
    }

    await interaction.followUp({
      ephemeral: true,
      embeds: [embed]
    });
  }
};