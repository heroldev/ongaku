import { BaseCommandInteraction, Client, MessageEmbed } from "discord.js";
import { Command } from "../types/Command";

export const Hello: Command = {
    name: "hello",
    description: "hi there!",
    type: "CHAT_INPUT",
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const embed = new MessageEmbed()
        .setColor('#d5eee1')
        .setTitle('hi there!')
        .setDescription('i\'m ongaku. i\'m a virtual cat that resides on the interwebs.\nin your reality i may be a bunch of ones and zeroes, but i don\'t let it get to me too much.')
  
        await interaction.followUp({
            ephemeral: true,
            embeds:[embed]
        });
    }
};