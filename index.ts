import { Intents, Collection, TextChannel, ThreadChannel } from 'discord.js';
import { discordClient } from './utils/classes';
import dotenv from 'dotenv';

dotenv.config()

const botToken = process.env.DISCORD_TOKEN
const discordChannel = process.env.DISCORD_CHANNEL_ID
export const client = new discordClient({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES] });

console.log('Loading bot');
client.commands = new Collection();
client.loadCommandsToClient();
client.loadEventsToClient();

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

    if (interaction.customId.startsWith('accept-')){

        const user = interaction.customId.split("-")[1]
        const parentChannel = client.channels.cache.get(discordChannel!);
        
        (parentChannel as TextChannel).threads
        .create({
            name: `pair`,
            autoArchiveDuration: 60,
            reason: 'Needed a separate thread for pairing',
        }).then((threadChannel: ThreadChannel) => {
            threadChannel.members.add(user)
            threadChannel.members.add(interaction.user.id)
        }).catch(console.error);
    }
})
        
client.login(botToken);