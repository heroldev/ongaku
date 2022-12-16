import { BaseCommandInteraction, Client, MessageEmbed } from "discord.js";
import dbGetPet from "../db/dbGetJam";
import { Command } from "../types/Command";
/**
 * Returns the amount of times a user has jammed Ongaku
 * @author heroldev (Andrew Herold)
 */
export const JamCount: Command = {
  name: "jamcount",
  description: "shows how many times we've jammed out together!",
  type: "CHAT_INPUT",
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    const embed = new MessageEmbed()
      .setColor('#efc8c2')
      .setTitle(interaction.user.username + "\'s jam count")

    const userPetCount = await dbGetPet(interaction.user.id).then((value: any) => {
      return value.length
    })

    embed.setDescription('you have jammed out with musebert ' + userPetCount + ' times!')
    if (userPetCount === 1) {
      embed.setDescription('you have jammed out with musebert ' + userPetCount + ' time!')
    }
    

    await interaction.followUp({
      ephemeral: true,
      embeds: [embed]
    });
  }
};