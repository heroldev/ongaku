import { Client, Guild } from "discord.js";
import { getListeningStatus } from "../util/listeningStatus";
import { Commands } from "../Commands";
import dbConnect from "../db/dbConnect";
import dbCreate from "../db/dbCreate";

/**
 * The main bot entry point. Go for launch!
 */
export default (client: Client): void => {
  client.on("ready", async () => {
    if (!client.user || !client.application) {
      return;
    }

    client.user.setPresence({
      status: 'online',
      activities: [getListeningStatus()]
    })

    // replace with BETA_GUILD_TOKEN for multi-person test server
    let guildId = (process.env.TEST_GUILD_TOKEN || '')

    dbCreate(process.env.DB_FILE_PATH || '')
    
    // uncomment this line for testing
    await client.application.commands.set(Commands, guildId);

    // uncomment this line for deployment
    // await client.application.commands.set(Commands);

    console.log(`${client.user.username} now on-line in guild ` + guildId);
  });
};