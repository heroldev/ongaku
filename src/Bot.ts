import { Client, Intents } from "discord.js";
import { updateListeningStatus } from "./jobs/updateStatus";
import interactionCreate from "./listeners/interactionCreate";
import ready from "./listeners/ready";
require('dotenv').config()

export const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_VOICE_STATES,
    ]
});

ready(client);
interactionCreate(client);

updateListeningStatus.start()

client.login(process.env.DISCORD_API_TOKEN);