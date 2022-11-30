import { BaseCommandInteraction, Client, MessageEmbed } from "discord.js";
import { Command } from "../types/Command";

export const Help: Command = {
  name: "help",
  description: "Info and commands for ongaku",
  type: "CHAT_INPUT",
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    const embed = new MessageEmbed()
      .setColor('#d5eee1')
      .setTitle('ongaku help & info')
      .setAuthor({ name: 'developed by heroldev', url: 'https://github.com/heroldev', iconURL: 'https://i.imgur.com/QuUEvbD.png' })
      .setDescription('Thank you for using ongaku!')
      .addFields(
        { name: 'Functionality', value: '- sends a Question of the Day at 7am Central Time to each registered server channel'},
        { name: 'General Commands', value: '`/hello` - omg hey :3\n`/help` - returns this message\n`/status` - returns meowbert status\n`/pet` - give me the pets :3\n`/petcount` - shows how many times you have petted me!' },
        { name: 'Question of the Day Commands (Admin Only)', value: '`/addqotd` - adds a new Question of the Day\n`/startqotd` - enables the Question of the Day and sets the channel where it will be sent\n`/stopqotd` - disables the Question of the Day' },
        { name: 'Developer Commands', value: '`/newqotd` - forcibly sends a new QOTD, regardless of time\n`/redoqotd` - sends the last-used QOTD\n`/broadcast` - sends a custom message to all QOTD channels'},
        )
      .setFooter({ text: 'ongaku v1.0.0', iconURL: 'https://i.imgur.com/QuUEvbD.png' });

    await interaction.followUp({
      ephemeral: true,
      embeds: [embed],
    })
  }
};