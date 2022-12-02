import { BaseCommandInteraction, Client, Guild, MessageEmbed } from "discord.js";
import { Command } from "../../types/Command";

export const Queue: Command = {
  name: "queue",
  description: "view the queue, or add a song to the queue",
  type: "CHAT_INPUT",
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    const embed = new MessageEmbed()
      .setColor('#d5eee1')
      .setTitle('pause failed!')
      .setDescription('no audio is currently playing.')

    await interaction.followUp({
      ephemeral: true,
      embeds: [embed]
    });
  }
};