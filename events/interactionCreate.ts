import { TextChannel, ThreadChannel } from 'discord.js';
import { supabase } from '../database';
import {client} from '../index'
import dotenv from 'dotenv';
dotenv.config()

export const name = 'interactionCreate';
export async function execute(interaction: any) {
    if (!interaction.isCommand() && !interaction.isButton()) return;
  
    // handle interactions that are commands
    if (interaction.isCommand()) {
        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) return;
        try {
            await command.execute(interaction)
            console.log(`${interaction.user.tag} in #${interaction.channel?.name} triggered an interaction.`);
        }
        catch (error) {
            console.error(error)
            try {
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
            catch (e) {
                console.error(e);
            }
        }   
    }

    // handle interactions that are buttons
    if (interaction.isButton()) {
        var starNames = require('@frekyll/star-names')
        const discordChannel = process.env.DISCORD_CHANNEL_ID

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
                threadChannel.send(`:partying_face: :partying_face: <@${sender_discord_id}> and <@${receiver_discord_id}>, have a great pairing!`)
    
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
    }
}