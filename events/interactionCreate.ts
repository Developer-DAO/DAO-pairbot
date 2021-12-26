import { MessageActionRow, MessageButton, TextChannel, ThreadChannel } from 'discord.js';
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

        if (interaction.customId.includes('invite')) {

            var starNames = require('@frekyll/star-names')
            const discordChannel = process.env.DISCORD_CHANNEL_ID
            
            //Getting the invite from the invites table
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
            const {sender_discord_id, receiver_discord_id} = data![0]; 

            //Invite received in the DMs
            if (interaction.customId.includes('dm-invite')) {
                //Deactivate buttons in dm
                await interaction.update({
                    components: [new MessageActionRow().addComponents(
                        new MessageButton()
                        .setCustomId(`dm-invite-accept-` + interaction.id)
                        .setLabel('Accept').setStyle('SUCCESS').setDisabled(true),
                        new MessageButton()
                        .setCustomId(`dm-invite-decline-` + interaction.id)
                        .setLabel('Decline').setStyle('DANGER').setDisabled(true))]
                });
            }
            
            //Declined invite in the DM
            if (interaction.customId.includes('dm-invite-decline')) {
                await interaction.followUp({
                    content: `Successfully **declined**!`,
                });
            }

            //Accepted invite in the DM
            if (interaction.customId.includes('dm-invite-accept')) {
                await interaction.followUp({
                    content: `Successfully **accepted**!`,
                });
            }

            if (interaction.customId.includes('invite-accept') && interaction.user.id == receiver_discord_id){
                
                const parentChannel = client.channels.cache.get(discordChannel!);
                // Create a thread and invite users.
                (parentChannel as TextChannel).threads
                .create({
                    name: `${starNames.random()}`,
                    autoArchiveDuration: 60,
                    reason: 'Needed a separate thread for pairing',
                }).then(async (threadChannel: ThreadChannel) => {
                    threadChannel.members.add(sender_discord_id);
                    threadChannel.members.add(receiver_discord_id);
                    threadChannel.send(`:partying_face: :partying_face: Have a great pairing!!`)
        
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
            }
        
            
        }
    }
}