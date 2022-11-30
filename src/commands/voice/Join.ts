import { BaseCommandInteraction, Client, Guild, GuildMember, MessageEmbed } from "discord.js";
import { Command } from "../../types/Command";

export const Join: Command = {
  name: "join",
  description: "enter a voice channel, if the user is already in one",
  type: "CHAT_INPUT",
  run: async (client: Client, interaction: BaseCommandInteraction) => {

    const guild: Guild = client.guilds.cache.get(interaction.guildId as string) as Guild; // Getting the guild.
    const member: GuildMember = guild.members.cache.get(interaction.user.id as string) as GuildMember; // Getting the member.

    const embed = new MessageEmbed()

    console.log(member.voice)

    if (member.voice.channel) { // Checking if the member is connected to a VoiceChannel.
      // The member is connected to a voice channel.
      // https://discord.js.org/#/docs/main/stable/class/VoiceState
      
      embed.setColor('#d5eee1')
      .setTitle('connected!')
      .setDescription(`${member.user.tag} is connected to ${member.voice.channel.name}!`)
    } else {
      // The member is not connected to a voice channel.
      embed.setColor('#d5eee1')
      .setTitle('not connected!')
      .setDescription(`${member.user.tag} is not connected to a voice channel.`)
    };

    await interaction.followUp({
      ephemeral: true,
      embeds: [embed]
    });
  }
};