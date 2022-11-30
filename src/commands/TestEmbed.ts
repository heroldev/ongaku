import { BaseCommandInteraction, Client, MessageEmbed } from "discord.js";
import dbGetMulti from "../db/dbGetMulti";
import { Command } from "../types/Command";

export const TestEmbed: Command = {
  name: "embed",
  description: "tests the embed",
  type: "CHAT_INPUT",
  run: async (client: Client, interaction: BaseCommandInteraction) => {

    dbGetMulti("SELECT guild_id, channel_id FROM qotd_channel").then((result: any) => {
      result.forEach((row: any) => console.log(row))
    })

    const embed = new MessageEmbed()
      .setColor('#d5eee1')
      .setTitle('Question of the Day')
      .setDescription('Where did you last take a poop?')
      .setTimestamp()
      .setFooter({ text: 'Question #69', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

    await interaction.followUp({
      ephemeral: true,
      embeds: [embed],
    })
  }
};