import { AudioPlayer, AudioPlayerStatus, createAudioPlayer, createAudioResource, DiscordGatewayAdapterCreator, entersState, joinVoiceChannel, StreamType, VoiceConnection, VoiceConnectionDisconnectReason, VoiceConnectionStatus } from "@discordjs/voice";
import { BaseCommandInteraction, Client, ClientUser, Guild, GuildMember, MessageEmbed, StageChannel, VoiceChannel } from "discord.js";
import { Command } from "../../types/Command";

import ytdl = require("ytdl-core");
import ytsr = require("ytsr");
import { Song } from "../../types/Song";

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
    } else {
      const channel = member.voice.channel
      const permissions = channel!.permissionsFor(client.user as ClientUser);

      if (!permissions!.has("CONNECT") || !permissions!.has("SPEAK")) {
        embed.setColor('#d5eee1')
          .setTitle('permissions issue!')
          .setDescription(`I'm lacking the necessary permissions to join or speak in the channel. Please make sure your permissions are set accordingly`)
      } else {

        // Get the song info
        let songInfo = null;
        try {
          songInfo = await getSongInfo(interaction.options.get("query", true).value!.toString());
        } catch (error) {
          console.log(error)
        }
        if (songInfo === null) {
          embed.setColor('#d5eee1')
            .setTitle('could not find the song!')
            .setDescription(`please provide a different link or query!`)
        } else {
          embed.setColor('#d5eee1')
            .setTitle('song found!')
            .setDescription(`${member.user.tag} is connected to ${member.voice.channel!.name}!`)

          console.log(songInfo)

          let ap = await getSongPlayer(songInfo!.videoDetails.video_url)

          const connection = joinVoiceChannel({
            guildId: interaction.guildId as string,
            channelId: member.voice.channelId as string,
            adapterCreator: member.voice.channel!.guild.voiceAdapterCreator
          })

          connection.subscribe(ap)

          embed.setColor('#d5eee1')
            .setTitle(`Now Playing: ${songInfo.videoDetails.title}`)
            .setDescription(`Length: ${songInfo.videoDetails.lengthSeconds} seconds.`)

          ap.on(AudioPlayerStatus.Idle, () => {
            connection.destroy()
          });
        }



      }
    }

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

/**
   * Read the user's arguments and get the song from youtube
   *
   * @param args the arguments of the user
   * @returns the song info of their desired song
   */
const getSongInfo = async (args: string): Promise<ytdl.videoInfo> => {
  let songInfo = null;
  let songUrl = args

  // Search for the song if the url is invalid
  // This part tends to break often, hence lots of try catch
  if (!ytdl.validateURL(songUrl)) {
    // Combine args
    let searchString = null;
    try {
      searchString = await ytsr.getFilters(args);
    } catch (error) {
      console.log(error);
      throw Error("Error parsing arguments");
    }

    // Try to find video
    const videoSearch = searchString.get("Type")!.get("Video");
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const results: any = await ytsr(videoSearch!.url || "", { limit: 1 });
      console.log(results);
      songUrl = results.items[0].url;
    } catch (error) {
      console.log(error);
      throw Error("Error searching for the song");
    }

    // Check that song URL is valid
    if (!ytdl.validateURL(songUrl)) {
      throw Error("Could not find the song");
    }
  }

  try {
    // Find the song details from URL
    songInfo = await ytdl.getInfo(songUrl);
  } catch (error) {
    console.log(error);
    throw Error("Error getting the video from the URL");
  }
  return songInfo;
}


const getSongPlayer = async (url: string): Promise<AudioPlayer> => {
  const player = createAudioPlayer();
  const stream = ytdl(url, {
    filter: "audioonly",
    highWaterMark: 1 << 25, // Set buffer size
  });
  const resource = createAudioResource(stream, {
    inputType: StreamType.Arbitrary,
  });
  player.play(resource);
  return entersState(player, AudioPlayerStatus.Playing, 5_000);
}