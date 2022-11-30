import { BaseCommandInteraction, Client, MessageEmbed } from "discord.js";
import dbGetPet from "../db/dbGetPet";
import { Command } from "../types/Command";
/**
 * Returns the amount of times a user has petted Ongaku
 * @author heroldev (Andrew Herold)
 */
export const PetCount: Command = {
  name: "petcount",
  description: "shows how many times you have pet me!",
  type: "CHAT_INPUT",
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    const embed = new MessageEmbed()
      .setColor('#d5eee1')
      .setTitle(interaction.user.username + "\'s pet count")

    const userPetCount = await dbGetPet(interaction.user.id).then((value: any) => {
      return value.length
    })

    embed.setDescription('you have pet ongaku ' + userPetCount + ' times!')
    if (userPetCount === 1) {
      embed.setDescription('you have pet ongaku ' + userPetCount + ' time!')
    }
    

    await interaction.followUp({
      ephemeral: true,
      embeds: [embed]
    });
  }
};