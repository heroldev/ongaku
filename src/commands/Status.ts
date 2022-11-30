import { BaseCommandInteraction, Client, MessageEmbed } from "discord.js";
import dbGetSingle from "../db/dbGetSingle";
import { Command } from "../types/Command";

/**
 * Returns detailed information about ongaku to the user who calls this command.
 */
export const Status: Command = {
  name: "status",
  description: "detailed information about ongaku",
  type: "CHAT_INPUT",
  run: async (client: Client, interaction: BaseCommandInteraction) => {

    const embed = new MessageEmbed()
      .setColor('#d5eee1')
      .setTitle('ongaku status')
      .setDescription('general and detailed info about ongaku')
      .addFields(
        { name: 'Build Date', value: process.env.BUILD_DATE || ''}
      )
      .setFooter({ text: 'ongaku v1.4.0', iconURL: 'https://i.imgur.com/QuUEvbD.png' });

    await interaction.followUp({
      ephemeral: true,
      embeds: [embed],
    })
  }
};