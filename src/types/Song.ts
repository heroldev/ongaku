import { GuildMember } from "discord.js";
import ytdl from "ytdl-core";

/**
 * Contains all the data for each song in the play song command
 */
 export interface Song {
  info: ytdl.videoInfo;
  title: string;
  url: string;
  duration: number;
  member: GuildMember;
}