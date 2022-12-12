import { BaseCommandInteraction, Client, MessageEmbed } from "discord.js";
import dbGetSingle from "../db/dbGetSingle";
import { Command } from "../types/Command";

/**
 * Returns detailed information about ongaku to the user who calls this command.
 */
export const Status: Command = {
  name: "status",
  description: "detailed information about musebert",
  type: "CHAT_INPUT",
  run: async (client: Client, interaction: BaseCommandInteraction) => {

    const embed = new MessageEmbed()
      .setColor('#efc8c2')
      .setTitle('musebert status')
      .setDescription('general and detailed info about musebert')
      .addFields(
        { name: 'Build Date', value: process.env.BUILD_DATE || ''}
      )
      .setFooter({ text: 'musebert v1.0.0', iconURL: 'https://i.imgur.com/FB5GOR0.png' });

    await interaction.followUp({
      ephemeral: true,
      embeds: [embed],
    })
  }
};