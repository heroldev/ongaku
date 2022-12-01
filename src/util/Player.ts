import { AudioPlayer, AudioPlayerStatus, createAudioPlayer, createAudioResource, entersState, StreamType } from "@discordjs/voice";
import { GuildMember } from "discord.js";
import ytdl from "ytdl-core";
import ytsr from "ytsr";
import { Song } from "../types/Song";

export class Player {
  url: string
  currentSong!: Song;
  member: GuildMember

  constructor(url: string, member: GuildMember) {
    this.url = url
    this.member = member
  }

  /**
   * Read the user's arguments and get the song from youtube
   *
   * @param args the arguments of the user
   * @returns the song info of their desired song
   */
  getSongInfo = async (): Promise<boolean> => {
    let songInfo = null;
    let songFound = false;
    let songUrl = this.url

    // Search for the song if the url is invalid
    // This part tends to break often, hence lots of try catch
    if (!ytdl.validateURL(songUrl)) {
      // Combine args
      let searchString = null;
      try {
        searchString = await ytsr.getFilters(songUrl);
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

    songFound = true
    this.currentSong = {
      info: songInfo,
      url: songInfo.videoDetails.video_url,
      title: songInfo.videoDetails.title,
      duration: parseInt(songInfo.videoDetails.lengthSeconds),
      member: this.member
    }
    return songFound
  }


  getSongPlayer = async (): Promise<AudioPlayer> => {
    const player = createAudioPlayer();
    const stream = ytdl(this.url, {
      filter: "audioonly",
      highWaterMark: 1 << 25, // Set buffer size
    });
    const resource = createAudioResource(stream, {
      inputType: StreamType.Arbitrary,
    });
    player.play(resource);
    return entersState(player, AudioPlayerStatus.Playing, 5_000);
  }

}

