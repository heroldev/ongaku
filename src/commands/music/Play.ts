import { AudioPlayer, AudioPlayerStatus, createAudioPlayer, createAudioResource, DiscordGatewayAdapterCreator, entersState, getVoiceConnection, joinVoiceChannel, StreamType, VoiceConnection, VoiceConnectionDisconnectReason, VoiceConnectionStatus } from "@discordjs/voice";
import { BaseCommandInteraction, Client, ClientUser, Guild, GuildMember, MessageEmbed, StageChannel, VoiceChannel } from "discord.js";
import { Command } from "../../types/Command";

import ytdl = require("ytdl-core");
import ytsr = require("ytsr");
import { Song } from "../../types/Song";
import { ServerQueue } from "../../util/ServerQueue";
import { EnqueueSong } from "./SongQueue";
import { YoutubeConnector } from "../../util/YoutubeConnector";

export const Play: Command = {
  name: "play",
  description: "plays a query from youtube",
  type: "CHAT_INPUT",
  options: [
    {
      name: 'query',
      type: 'STRING',
      description: 'a youtube video URL or query to search',
      required: true
    },
  ],
  run: async (client: Client, interaction: BaseCommandInteraction) => {

    const embed = new MessageEmbed()

    const guild: Guild = client.guilds.cache.get(interaction.guildId as string) as Guild; // Getting the guild.
    const member: GuildMember = guild.members.cache.get(interaction.user.id as string) as GuildMember; // Getting the member.

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

    const channel = member.voice.channel
    const permissions = channel!.permissionsFor(client.user as ClientUser);

    if (!permissions!.has("CONNECT") || !permissions!.has("SPEAK")) {
      embed.setColor('#efc8c2')
        .setTitle('permissions issue!')
        .setDescription(`I'm lacking the necessary permissions to join or speak in the channel. Please make sure your permissions are set accordingly`)

      await interaction.followUp({
        ephemeral: true,
        embeds: [embed]
      });
      return
    }

    let ytc = new YoutubeConnector()

    let songInfo = await ytc.getSongInfo(interaction.options.get("query", true).value!.toString(), member)

    if (!songInfo) {
      embed.setColor('#efc8c2')
        .setTitle('could not find the song!')
        .setDescription(`please provide a different link or query!`)

      await interaction.followUp({
        ephemeral: true,
        embeds: [embed]
      });
      return
    }

    const clientChannel = guild.members.cache.get(client.user?.id as string)?.voice.channel

    // if it finds the song, then add it to the queue and exit, or play it
    if (ServerQueue.get(interaction.guildId as string)) {
      if (!ServerQueue.get(interaction.guildId as string)?.isEmpty()) {
        EnqueueSong(guild, songInfo)
        embed.setColor('#efc8c2')
          .setTitle(`Song queued!`)
          .setDescription(`musebert is connected to ${clientChannel}`)
          .setImage(songInfo.info.videoDetails.thumbnails[0].url)
          .addFields(
            { name: 'video title', value: `${songInfo.title}` },
            { name: 'requested by', value: `${songInfo.member.user.tag}`, inline: true },
            { name: 'length', value: `${songInfo.duration}`, inline: true },
            { name: 'video link', value: `[youtube](${songInfo.url})`, inline: true }
          )
          .setFooter({ text: `use \`/queue\` to view upcoming videos` })
        await interaction.followUp({
          ephemeral: true,
          embeds: [embed]
        });
        return
      }
    }

    // add it to the queue and make a new song player
    EnqueueSong(guild, songInfo)
    songplayer(interaction, member, guild)

    embed.setColor('#efc8c2')
      .setTitle(`Now Playing!`)
      .setDescription(`musebert is connected to ${member.voice.channel}`)
      .setImage(songInfo.info.videoDetails.thumbnails[0].url)
      .addFields(
        { name: 'video title', value: `${songInfo.title}` },
        { name: 'requested by', value: `${songInfo.member.user.tag}`, inline: true },
        { name: 'length', value: `${songInfo.duration}`, inline: true },
        { name: 'video link', value: `[youtube](${songInfo.url})`, inline: true }
      )
      .setFooter({ text: `use \`/queue\` to view upcoming videos` })

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
export const userNotInChannel = (member: GuildMember): boolean => {

  if (member.voice.channel) {
    // member is in a channel and the bot can see that
    return false
  }
  return true

}

export const songplayer = async (interaction: BaseCommandInteraction, member: GuildMember, guild: Guild) => {

  if (!getVoiceConnection(interaction.guildId as string)) {
    // join the voice channel if a connection doesn't already exist
    joinVoiceChannel({
      guildId: interaction.guildId as string,
      channelId: member.voice.channelId as string,
      adapterCreator: member.voice.channel!.guild.voiceAdapterCreator
    })
  }

  let ytc = new YoutubeConnector()

  let stream = await ytc.getStream(interaction.options.get("query", true).value!.toString())

  let ap = createAudioPlayer()
  ap.play(stream)

  const connection = getVoiceConnection(interaction.guildId as string)
  connection?.subscribe(ap)

  ap.on(AudioPlayerStatus.Idle, async () => {
    ServerQueue.get(interaction.guildId as string)?.dequeue()

    //check the queue
    if (!ServerQueue.get(interaction.guildId as string)?.isEmpty()) {
      let nextSong = ServerQueue.get(interaction.guildId as string)?.front()

      let stream = await ytc.getStream(nextSong?.url as string)
      ap.play(stream);
      entersState(ap, AudioPlayerStatus.Playing, 5_000);
    } else {
      /*
      ServerQueue.delete(interaction.guildId as string)
      connection!.destroy()
      */
      if (guild.me?.voice.channel?.members.size! <= 1) {
        ServerQueue.delete(interaction.guildId as string)
        connection!.destroy()
      }
    }
  });

}

