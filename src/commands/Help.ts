import { BaseCommandInteraction, Client, MessageEmbed } from "discord.js";
import { Command } from "../types/Command";

export const Help: Command = {
  name: "help",
  description: "Info and commands for musebert",
  type: "CHAT_INPUT",
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    const embed = new MessageEmbed()
      .setColor('#efc8c2')
      .setTitle('musebert help & info')
      .setAuthor({ name: 'developed by heroldev', url: 'https://github.com/heroldev', iconURL: 'https://i.imgur.com/FB5GOR0.png' })
      .setDescription('thank you for using musebert!')
      .addFields(
        { name: 'Functionality', value: 'a simple youtube music bot to make your day slightly better' },
        { name: 'General Commands', value: '`/help` - returns this message\n`/status` - returns musebert status\n`/pet` - give me the pets :3\n`/petcount` - shows how many times you have petted me!' },
        { name: 'Playback Commands', value: '`/play <query>` - plays or queues a video from a youtube video URL\n`/queue` - displays the current video queue, or adds a video to the queue\n`/pause` - pauses the player\n`/unpause` - unpauses the player\n`/skip` - skips the currently playing video\n`/clear` - clears the queue, but does not stop the player\n`/stop` - stops the player and clears the queue' },
        )
      .setFooter({ text: 'musebert v1.0.0', iconURL: 'https://i.imgur.com/FB5GOR0.png' });

    await interaction.followUp({
      ephemeral: true,
      embeds: [embed],
    })
  }
};