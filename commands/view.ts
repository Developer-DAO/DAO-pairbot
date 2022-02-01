import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, Message, MessageActionRow, MessageButton, MessageComponentInteraction } from 'discord.js';
import { supabase } from '../database';
import { createDeveloperEmbed } from '../components/developerEmbed';
import { inviteDeveloper } from '../components/inviteDeveloper';

export const ViewCommand = {
    name: 'view',
    commandJSON: () => {
        return new SlashCommandBuilder()
        .setName('view')
        .setDescription("View a developer's profile")
        .addUserOption(option => option.setRequired(true).setName('developer').setDescription("Developer's Discord Tag"))      
    },
    execute: async (interaction: CommandInteraction) => { 
        const { options } = interaction;  
    
        const { data, error } = await supabase
        .from('developers')
        .select()
        .eq('discord_id', options.getUser('developer')?.id)
    
        if (error != null) {
            await interaction.reply({
                content: 'Something went wrong.',
                ephemeral: true,
            }); 
    
            return
        }
    
        if (data!.length === 0) {
            await interaction.reply({
                content: 'User not found in the pairing database.',
                ephemeral: true,
            })
    
            return
        }
    
        // Checking if the person has already been invited
        const { data: alreadyInvited, error: invitedError } = await supabase
        .from('invites')
        .select()
        .eq('sender_discord_id', interaction.user.id)
        .eq('receiver_discord_id', options.getUser('developer')?.id)
        
        if (invitedError != null) {
            await interaction.editReply({
                content: 'Something went wrong.',
            }); 
            return;
        }
    
        const developerProfile = createDeveloperEmbed(options.getUser('developer')?.avatarURL()!, data![0]);
    
        const inviteRow = new MessageActionRow()
        .addComponents(new MessageButton()
        .setCustomId('view' + interaction.id)
        .setLabel('Invite').setStyle('SUCCESS')
        .setDisabled(!data![0].available || alreadyInvited!.length !== 0))
    
        await interaction.reply({
            embeds: [developerProfile],
            components: options.getUser('developer')!.id !== interaction.user.id ? [inviteRow] : [],
            ephemeral: true,
        });
    
        const interactionMessage = await interaction.fetchReply();
    
        if (!(interactionMessage instanceof Message)) { return; }
      
        const filter = (i: any) => {
            i.deferUpdate();
            return i.customId === 'view' + interaction.id; }
            
        //Invite button
        await interactionMessage
        .awaitMessageComponent({ filter, time: 60000, componentType: 'BUTTON' })
        .then(async (i: MessageComponentInteraction) => {
            const { data: inviterData, error: inviterError } = await supabase
            .from('developers')
            .select()
            .eq('discord_id', interaction.user?.id)
          
            if (inviterError != null) {
                await interaction.reply({
                    content: 'Something went wrong.',
                    ephemeral: true,
                }); 
        
                return
            }
            
            //Invites the developer
            if (i.customId === 'view' + interaction.id) {
                await inviteDeveloper(interaction, options, inviterData);
            }
    
            const disabledButton = new MessageActionRow()
            .addComponents(new MessageButton()
            .setCustomId('view' + interaction.id)
            .setLabel('Invite').setStyle('SUCCESS').setDisabled(true));
    
            interaction.editReply({
                content: '**INVITED**!',
                components: [disabledButton]
            })
        })
        .catch((err: any) => console.log(err))
    }
}
