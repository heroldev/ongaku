import { BaseCommandInteraction, Client, EmbedFieldData, Guild, GuildMember, MessageEmbed, VoiceState } from "discord.js";
import { Command } from "../../types/Command";
import { ServerQueue } from "../../util/ServerQueue";
import { Queue } from "@datastructures-js/queue";
import { Song } from "../../types/Song";
import { YoutubeConnector } from "../../util/YoutubeConnector";
import { AudioPlayerStatus, getVoiceConnection, VoiceConnectionReadyState, VoiceConnectionState } from "@discordjs/voice";

export const SongQueue: Command = {
  name: "queue",
  description: "view the queue, or add a song to the queue",
  type: "CHAT_INPUT",
  options: [
    {
      name: 'query',
      type: 'STRING',
      description: 'a youtube video URL or query to search',
      required: false
    },
  ],
  run: async (client: Client, interaction: BaseCommandInteraction) => {

    const embed = new MessageEmbed()

    const guild: Guild = client.guilds.cache.get(interaction.guildId as string) as Guild; // Getting the guild.
    const member: GuildMember = guild.members.cache.get(interaction.user.id as string) as GuildMember; // Getting the member.

    if (interaction.options.get("query", false)) {

      if (!ServerQueue.has(guild.id)) {
        embed.setColor('#efc8c2')
          .setTitle(`musebert isn't already active!`)
          .setDescription(`please use \`/play\` to start listening before adding videos via \`/queue\``)

        await interaction.followUp({
          ephemeral: true,
          embeds: [embed]
        });
        return
      }

      // a song was requested to be queued
      let ytc = new YoutubeConnector()

      let songInfo = await ytc.getSongInfo(interaction.options.get("query", true).value!.toString(), member);

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

      const conn = getVoiceConnection(guild.id)?.state as VoiceConnectionReadyState

      if (conn.subscription?.player.state.status === AudioPlayerStatus.Idle) {
        embed.setColor('#efc8c2')
          .setTitle('no videos in the queue!')
          .setDescription('use \`/play\` to get the party started!')
        await interaction.followUp({
          ephemeral: true,
          embeds: [embed]
        });
        return
      }

      EnqueueSong(guild, songInfo)

      const clientChannel = guild.members.cache.get(client.user?.id as string)?.voice.channel

      embed.setColor('#efc8c2')
        .setTitle('Song queued!')
        .setDescription(`musebert is connected to ${clientChannel}`)
        .setImage(songInfo.info.videoDetails.thumbnails[0].url)
        .addFields(
          { name: 'video title', value: `${songInfo.title}` },
          { name: 'requested by', value: `${songInfo.member.user.tag}`, inline: true },
          { name: 'length', value: `${songInfo.duration} seconds`, inline: true },
          { name: 'video link', value: `[youtube](${songInfo.url})`, inline: true }
        )

    } else {
      // print the queue as an embed
      if (ServerQueue.has(guild.id)) {
        let queueList: EmbedFieldData[] = []

        let upcomingSongs = ""
        ServerQueue.get(guild.id)?.toArray().forEach((song, index) => {
          if (index == 0) {
            queueList.push({
              name: "Currently Playing",
              value: `${song.title}`
            })
          } else {
            upcomingSongs += `${index}: ${song.title}\n`
          }
        })

        if (ServerQueue.get(guild.id)!.toArray().length > 1) {
          queueList.push({
            name: "Up Next",
            value: upcomingSongs
          })
        }

        const clientChannel = guild.members.cache.get(client.user?.id as string)?.voice.channel

        embed.setColor('#efc8c2')
          .setTitle('Current Queue:')
          .setDescription(`musebert is connected to ${clientChannel}`)
          .addFields(queueList)

      } else {
        embed.setColor('#efc8c2')
          .setTitle('no videos in the queue!')
          .setDescription('use \`/play\` to get the party started!')
      }
    }

    await interaction.followUp({
      ephemeral: true,
      embeds: [embed]
    });
  }
};

export const EnqueueSong = (guild: Guild, song: Song) => {
  if (ServerQueue.has(guild.id)) {
    // queue the song 
    ServerQueue.get(guild.id)?.enqueue(song)

  } else {
    // no queue is created, create the queue and add the song to the queue
    let queue = new Queue<Song>()
    queue.enqueue(song)
    ServerQueue.set(guild.id, queue)
  }
}

export const DequeueSong = (guild: Guild) => {
  if (ServerQueue.has(guild.id)) {
    // dequeue the song 
    let song = ServerQueue.get(guild.id)?.dequeue()
    return song
  }
}