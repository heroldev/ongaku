import { Queue } from "@datastructures-js/queue";
import { AudioPlayer, DiscordGatewayAdapterCreator, getVoiceConnection, joinVoiceChannel, VoiceConnectionReadyState } from "@discordjs/voice";
import { BaseCommandInteraction, Client, Guild, GuildMember, MessageEmbed } from "discord.js";
import { Command } from "../types/Command";
import { Song } from "../types/Song";
import { ServerQueue } from "../util/ServerQueue";
import { userNotInChannel } from "./music/Play";

export const Switch: Command = {
  name: "switch",
  description: "switches the player to another channel",
  type: "CHAT_INPUT",
  run: async (client: Client, interaction: BaseCommandInteraction) => {

    const embed = new MessageEmbed()

    const guild: Guild = client.guilds.cache.get(interaction.guildId as string) as Guild; // Getting the guild.
    const member: GuildMember = guild.members.cache.get(interaction.user.id as string) as GuildMember; // Getting the member.

    if (!ServerQueue.get(guild.id)) {
      embed.setColor('#efc8c2')
        .setTitle('switch failed!')
        .setDescription('no audio is currently playing.')
      await interaction.followUp({
        ephemeral: true,
        embeds: [embed]
      });
      return
    }

    if (userNotInChannel(member)) {
      embed.setColor('#efc8c2')
        .setTitle('not connected!')
        .setDescription(`You are not connected to a voice channel. Please connect to a channel to play music.`)

      await interaction.followUp({
        ephemeral: true,
        embeds: [embed]
      });
      return
    }

    const connection = getVoiceConnection(guild.id)

    const clientChannel = guild.members.cache.get(client.user?.id as string)?.voice.channel

    if (connection !== undefined) {

      if (member.voice.channelId === clientChannel?.id) {
        embed.setColor('#efc8c2')
          .setTitle('switch failed!')
          .setDescription(`musebert is already in the same channel as you!`)
        await interaction.followUp({
          ephemeral: true,
          embeds: [embed]
        });
        return
      }

      let state = connection.state as VoiceConnectionReadyState
      const ap = state.subscription?.player as AudioPlayer
      connection.disconnect()

      joinVoiceChannel({
        guildId: interaction.guildId as string,
        channelId: member.voice.channelId as string,
        adapterCreator: member.voice.channel!.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator
      })
      connection.subscribe(ap)

      // FIX DISCORD.JS Bug
      // https://github.com/discordjs/discord.js/issues/9185#issuecomment-1452514375
      // ----------------------------------------------------------------------------
      const networkStateChangeHandler = (oldNetworkState: any, newNetworkState: any) => {
        const newUdp = Reflect.get(newNetworkState, 'udp');
        clearInterval(newUdp?.keepAliveInterval);
      }

      connection.on('stateChange', (oldState, newState) => {
        const oldNetworking = Reflect.get(oldState, 'networking');
        const newNetworking = Reflect.get(newState, 'networking');

        oldNetworking?.off('stateChange', networkStateChangeHandler);
        newNetworking?.on('stateChange', networkStateChangeHandler);
      });
      // ----------------------------------------------------------------------------



      embed.setColor('#efc8c2')
        .setTitle('channel switch!')
        .setDescription(`musebert is now connected to ${member.voice.channel}`)
    }

    await interaction.followUp({
      ephemeral: true,
      embeds: [embed]
    });
  }
};