import { MessageActionRow, MessageButton, TextChannel, ThreadChannel, GuildMemberRoleManager, Interaction } from 'discord.js';
import { discordClient } from '../utils';
import { supabase } from '../database';
import {client} from '../index'
import dotenv from 'dotenv';
import { DiscordAPIError } from '@discordjs/rest';
dotenv.config()

export const InteractionCreateEvent: any = {
    name: 'interactionCreate',
    once: false,
    execute: async (interaction: Interaction) => {
        if (!interaction.isCommand() && !interaction.isButton() || interaction.user.bot) return;
  
        // handle interactions that are commands
        if (interaction.client instanceof discordClient && interaction.isCommand()) {
         
            //@ts-ignore
            const command = interaction.client.commands.get(interaction.commandName);
      
            if (!command) return;
            try {
                await command.execute(interaction)
                console.log(`${interaction.user.tag} triggered an interaction.`);
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
            if (interaction.customId.includes('dm-invite') ||
                interaction.customId.includes('channel-invite')) {
               
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
                    (parentChannel as TextChannel).threads
                    .create({
                        name: `${starNames.random()}`,
                        autoArchiveDuration: 60,
                        type: 'GUILD_PRIVATE_THREAD',
                        reason: 'Needed a separate thread for pairing'
                    }).then(async (threadChannel: ThreadChannel) => {
                        threadChannel.members.add(sender_discord_id);
                        threadChannel.members.add(receiver_discord_id);
                        threadChannel.send(`:partying_face: :partying_face: Have a great pairing!!`)
            
                    }).catch((e: DiscordAPIError) => {
    
                        //Guild premium subscription level too low
                        if (e.code == 20035) {
                            (parentChannel as TextChannel).threads
                            .create({
                                name: `${starNames.random()}`,
                                autoArchiveDuration: 60,
                                reason: 'Needed a separate thread for pairing'
                            })
                            .then(async (threadChannel: ThreadChannel) => {
                                threadChannel.members.add(sender_discord_id);
                                threadChannel.members.add(receiver_discord_id);
                                threadChannel.send(`:partying_face: :partying_face: Have a great pairing!!`)
                            })
                            .catch(err => console.log(err));
                        }
                    });

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
                }
            
                
            }
        }
    }
}