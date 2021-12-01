import { Intents, Collection, TextChannel, ThreadChannel } from 'discord.js';
import { discordClient } from './utils/classes';
import { supabase } from './database';
var starNames = require('@frekyll/star-names')
import dotenv from 'dotenv';

dotenv.config()

const botToken = process.env.DISCORD_TOKEN
const discordChannel = process.env.DISCORD_CHANNEL_ID
export const client = new discordClient({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES] });

console.log('Loading bot');
client.commands = new Collection();
client.loadCommandsToClient();
client.loadEventsToClient();
client.login(botToken);

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;
  
    if (interaction.customId === 'accept'){
        const { data, error } = await supabase
        .from('invites')
        .select()
        .eq('message_id', interaction.message.id)

        if (error != null) {
            await interaction.reply({
                content: 'Something went wrong.',
                ephemeral: true
            }); 
    
            return
        }
   
      
        const parentChannel = client.channels.cache.get(discordChannel!);
        const {sender_discord_id, receiver_discord_id} = data![0]; 
       
        // Create a thread and invite users.
        (parentChannel as TextChannel).threads
        .create({
            name: `${starNames.random()}`,
            autoArchiveDuration: 60,
            reason: 'Needed a separate thread for pairing',
        }).then(async (threadChannel: ThreadChannel) => {
            threadChannel.members.add(sender_discord_id);
            threadChannel.members.add(receiver_discord_id);

            // delete invite record
            const { error } = await supabase
            .from('invites')
            .delete()
            .eq('message_id', interaction.message.id)
    
            if (error != null) {
                await interaction.reply({
                    content: 'Something went wrong.',
                    ephemeral: true
                }); 
        
                return;
            } 
        }).catch(console.error);

        // Let the inviter know if the user has accepted.
        (await client.users.fetch(sender_discord_id)).send({
            content: `${interaction.user.tag} has accepted your invite!`
        })

        await interaction.reply({
            content: 'Invitation successfully accepted!',
        });
    }

    if (interaction.customId === 'decline'){
        const { error } = await supabase
        .from('invites')
        .delete()
        .eq('message_id', interaction.message.id)

        if (error != null) {
            await interaction.reply({
                content: 'Something went wrong.',
                ephemeral: true
            }); 
    
            return;
        }  

        await interaction.reply({
            content: 'Invitation successfully declined!',
        });
    }
})



