import { BaseCommandInteraction, Client, MessageEmbed } from "discord.js";
import dbIncrementPet from "../db/dbIncrementPet";
import { Command } from "../types/Command";
import { PetType } from "../types/PetType";
/**
 * Pet command
 * Sends a command as if the user was physically petting ongaku in cat form. Has a 12.5% chance to result in ongaku biting the user.
 * @author heroldev (Andrew Herold)
 */
export const Pet: Command = {
    name: "pet",
    description: "omg u givin me the pets",
    type: "CHAT_INPUT",
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const embed = new MessageEmbed()
        .setColor('#d5eee1')
        .setTitle('omg! :3')
        .setDescription('ur pettin\' me! *purrs contently*')

        let type = PetType.PET

        const chance = Math.random()
        if (chance < .125) {
            // 12.5% chance to bite the user petting ongaku
            embed.setTitle('monch >:3')
            .setDescription('*bites '+ interaction.user.username +'\'s hand*')
            type = PetType.BITE
        }

        const petNumber = await dbIncrementPet(interaction.user.id, type).then((value: any) => {
            return value.id
        })

        embed.setFooter({ text: 'that makes ' + petNumber + ' pets!' })
  
        await interaction.followUp({
            ephemeral: true,
            embeds:[embed]
        });
    }
};