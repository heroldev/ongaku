import { BaseCommandInteraction, Client, MessageEmbed } from "discord.js";
import dbIncrementJam from "../db/dbIncrementJam";
import { Command } from "../types/Command";
import { PetType } from "../types/PetType";
/**
 * Keyboard command
 * Sends a random gif of musebert tickling the ivories. Has an XP bar that increases each time it's used.
 * @author heroldev (Andrew Herold)
 */
export const Jam: Command = {
    name: "jam",
    description: "ayo time to play the keeb :3",
    type: "CHAT_INPUT",
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const embed = new MessageEmbed()
        .setColor('#efc8c2')
        .setTitle('omg! :3')
        .setDescription('i be playin sum BANGER tunes frfr')

        const jamNumber = await dbIncrementJam(interaction.user.id).then((value: any) => {
            return value.id
        })

        embed.setImage("https://i.imgur.com/rDeTCNZ.gif")
        embed.setFooter({ text: `i've tickled the ivories ${jamNumber} times!` })
  
        await interaction.followUp({
            ephemeral: true,
            embeds:[embed]
        });
    }
};