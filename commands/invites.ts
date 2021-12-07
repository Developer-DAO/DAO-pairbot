import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { client } from '..';
import { supabase } from '../database';
import { createDeveloperEmbed } from '../components/developerEmbed';
const invitesPaginator = require('../components/invitesPaginator.js')

export const data = new SlashCommandBuilder()
    .setName('invites')
    .setDescription('List invites that you have received')

export async function execute(interaction: CommandInteraction) {
    await interaction.deferReply({ 
        ephemeral: true
    })

    const { data, error } = await supabase
    .from('invites')
    .select('sender_discord_id, message_id')
    .eq('receiver_discord_id', interaction.user.id)

    if (error != null) {
        await interaction.editReply({
            content: 'Something went wrong.'
        }); 

        return
    }

    if (data!.length === 0) {
        await interaction.editReply({
            content: 'You have no pending invites.'
        });
        
        return
    }

    let pages = [];
    let senderDiscordIds = []; // discord ids of all those who sent an invite
    for (const invite of data!) {

        // Getting the inviter's record
        const { data, error } = await supabase
        .from('developers')
        .select()
        .eq('discord_id', invite.sender_discord_id)

        if (error != null) {
            await interaction.editReply({
                content: 'Something went wrong.'
            }); 

            return
        }

        // Return if no invites were found
        if (data!.length === 0) await interaction.editReply({
            content: 'You have no invites.'
        })
    
        const user = await client.users?.fetch(data![0].discord_id);
        senderDiscordIds.push(user.id);

        const embedMessage = createDeveloperEmbed(user.avatarURL() ?? user.defaultAvatarURL, data![0])
        pages.push(embedMessage)  
    }

    invitesPaginator(interaction, pages, senderDiscordIds);
   
}