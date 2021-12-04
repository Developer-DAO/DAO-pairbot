import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { client } from '..';
import { supabase } from '../database';
const paginationEmbed = require('../components/paginationEmbed.js')

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

        const { 
            discord_id,
            timezone,
            discord, 
            position, 
            skills, 
            desired_skills, 
            goal,
            available,
            github,
            twitter
        } = data![0]
    
        const user = await client.users?.fetch(discord_id);
        senderDiscordIds.push(user.id);

        const embedMessage = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle(`${discord.charAt(0).toUpperCase() + discord.slice(1)}'s profile`)
        .setThumbnail(user.avatarURL() ?? user.defaultAvatarURL)
        .setDescription(position)
        .addFields(
            {name: 'Available', value: available ? 'True' : 'False'},
            {name: 'Timezone', value: timezone},
            {name: 'Skills', value: skills}, 
            {name: 'Desired Skills', value: desired_skills},
            {name: 'Goal', value: goal ?? "none"},
            {name: 'Github', value: `__[github.com/${github}](https://github.com/${github})__`, inline: true},
            {name: 'Twitter', value: `__[twitter.com/${twitter}](https://twitter.com/${twitter})__`, inline: true},
        )
    
        pages.push(embedMessage)  
    }

    paginationEmbed(interaction, pages, senderDiscordIds);
   
}