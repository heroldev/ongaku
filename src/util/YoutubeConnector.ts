import { AudioResource, createAudioResource, entersState, StreamType } from "@discordjs/voice";
import { GuildMember } from "discord.js";
import ytdl from "ytdl-core";
import ytsr from "ytsr";
import { Song } from "../types/Song";

export class YoutubeConnector {

  /**
 * Read the user's arguments and get the song information from youtube
 * @param url 
 * @param member 
 * @returns 
 */
  getSongInfo = async (url: string, member: GuildMember): Promise<Song> => {
    let songInfo = null;
    let songFound = false;
    let songUrl = url

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

    let video_length = parseInt(songInfo.videoDetails.lengthSeconds)
    let minutes = Math.floor(video_length / 60)
    let seconds = video_length % 60

    let video_length_display = `\`${minutes}:${seconds}\``

    if (video_length >= 3600) {
      let hours = Math.floor(video_length / 3600)
      let minutes = Math.floor(video_length / 60) - (hours * 60)
      seconds = video_length % 60
      video_length_display = `\`${hours}:${minutes}:${seconds}\``
    }

    return {
      info: songInfo,
      url: songInfo.videoDetails.video_url,
      title: songInfo.videoDetails.title,
      duration: video_length_display,
      member: member
    }
  }


  getStream = async (url: string): Promise<AudioResource> => {
    const stream = ytdl(url, {
      filter: "audioonly",
      highWaterMark: 1 << 25, // Set buffer size
    });
    const resource = createAudioResource(stream, {
      inputType: StreamType.Arbitrary,
    });
    return resource

  }

}

