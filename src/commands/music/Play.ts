import { AudioPlayer, AudioPlayerStatus, createAudioPlayer, createAudioResource, DiscordGatewayAdapterCreator, entersState, getVoiceConnection, joinVoiceChannel, StreamType, VoiceConnection, VoiceConnectionDisconnectReason, VoiceConnectionStatus } from "@discordjs/voice";
import { BaseCommandInteraction, Client, ClientUser, Guild, GuildMember, MessageEmbed, StageChannel, VoiceChannel } from "discord.js";
import { Command } from "../../types/Command";

import ytdl = require("ytdl-core");
import ytsr = require("ytsr");
import { Song } from "../../types/Song";
import { Player } from "../../util/Player";

export const Play: Command = {
  name: "play",
  description: "plays a query from youtube",
  type: "CHAT_INPUT",
  options: [
    {
      name: 'query',
      type: 'STRING',
      description: 'a youtube video/playlist URL or query to search',
      required: true
    },
  ],
  run: async (client: Client, interaction: BaseCommandInteraction) => {

    const embed = new MessageEmbed()

    const guild: Guild = client.guilds.cache.get(interaction.guildId as string) as Guild; // Getting the guild.
    const member: GuildMember = guild.members.cache.get(interaction.user.id as string) as GuildMember; // Getting the member.

    if (userNotInChannel(member)) {
      embed.setColor('#d5eee1')
        .setTitle('not connected!')
        .setDescription(`You are not connected to a voice channel. Please connect to a channel to play music.`)

      await interaction.followUp({
        ephemeral: true,
        embeds: [embed]
      });
      return
    }

    const channel = member.voice.channel
    const permissions = channel!.permissionsFor(client.user as ClientUser);

    if (!permissions!.has("CONNECT") || !permissions!.has("SPEAK")) {
      embed.setColor('#d5eee1')
        .setTitle('permissions issue!')
        .setDescription(`I'm lacking the necessary permissions to join or speak in the channel. Please make sure your permissions are set accordingly`)

      await interaction.followUp({
        ephemeral: true,
        embeds: [embed]
      });
      return
    }

    // Get the song info
    let player = new Player(interaction.options.get("query", true).value!.toString(), member)

    let songFound = await player.getSongInfo();

    if (!songFound) {
      embed.setColor('#d5eee1')
        .setTitle('could not find the song!')
        .setDescription(`please provide a different link or query!`)

      await interaction.followUp({
        ephemeral: true,
        embeds: [embed]
      });
      return
    }

    embed.setColor('#d5eee1')
      .setTitle('song found!')
      .setDescription(`${member.user.tag} is connected to ${member.voice.channel!.name}!`)

    let ap = await player.getSongPlayer()

    const connection = joinVoiceChannel({
      guildId: interaction.guildId as string,
      channelId: member.voice.channelId as string,
      adapterCreator: member.voice.channel!.guild.voiceAdapterCreator
    })

    connection.subscribe(ap)

    embed.setColor('#d5eee1')
      .setTitle(`Now Playing!`)
      .setDescription(`musebert is connected to ${member.voice.channel}`)
      .setImage(player.currentSong.info.videoDetails.thumbnails[0].url)
      .addFields(
        { name: 'video title', value: `${player.currentSong.title}`},
        { name: 'requested by', value: `${player.currentSong.member.user.tag}`, inline: true },
        { name: 'length', value: `${player.currentSong.duration} seconds`, inline: true },
        { name: 'video link', value: `[youtube](${player.currentSong.url})`, inline: true}
        )
      .setFooter({ text: `use \`/queue\` to view upcoming videos`})

    ap.on(AudioPlayerStatus.Idle, () => {
      connection.destroy()
    });

    await interaction.followUp({
      ephemeral: true,
      embeds: [embed]
    });
  }
};

/**
 * Checks if the user or bot lacks permissions to access a voice channel
 * @param client 
 * @param interaction 
 */
const userNotInChannel = (member: GuildMember): boolean => {

  if (member.voice.channel) {
    // member is in a channel and the bot can see that
    return false
  }
  return true

}


