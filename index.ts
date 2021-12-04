import { Intents, Collection} from 'discord.js';
import { discordClient } from './utils/classes';
import dotenv from 'dotenv';
import Scheduler from './utils/scheduledJobs'
dotenv.config()

const botToken = process.env.DISCORD_TOKEN
export const client = new discordClient({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES] });

console.log('Loading bot');
client.commands = new Collection();
client.loadCommandsToClient();
client.loadEventsToClient();
client.login(botToken);
Scheduler()