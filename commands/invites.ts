import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { client } from '..';
import { supabase } from '../database';

export const data = new SlashCommandBuilder()
    .setName('invites')
    .setDescription('List invites that you have received')

export async function execute(interaction: CommandInteraction) {
    await interaction.deferReply({
        ephemeral: true
    });

    const { data, error } = await supabase
    .from('invites')
    .select('sender_discord_id, message_id')
    .eq('receiver_discord_id', interaction.user.id)

    let pages = [];
    
    for (const invite of data!) {

        // Getting the inviter's record
        const { data: inviterData, error: inviterError } = await supabase
        .from('developers')
        .select()
        .eq('discord_id', invite.sender_discord_id)

        if (inviterError != null) {
            await interaction.editReply({
                content: 'Something went wrong.',
            }); 

            return
        }

        const { 
            discord_id: inviterDiscordId,
            timezone: inviterTimezone,
            discord: inviterDiscord, 
            skills:inviterSkills, 
            desired_skills: inviterDesiredSkills, 
            goal: inviterGoal,
            position: inviterPosition, 
            twitter: inviterTwitter, 
            github: inviterGithub,
            available: inviterAvailable } = inviterData![0]
    
        const user = await client.users?.fetch(inviterDiscordId);
      
        const embedMessage = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle(`${inviterDiscord.charAt(0).toUpperCase() + inviterDiscord.slice(1)}'s profile`)
        .setThumbnail(user.avatarURL() ?? user.defaultAvatarURL)
        .setDescription(inviterPosition)
        .addFields(
            {name: 'Skills', value: inviterSkills}, 
            {name: 'Desired Skills', value: inviterDesiredSkills},
            {name: 'Goal', value: inviterGoal ?? "none"},
            {name: 'Available', value: inviterAvailable ? 'True' : 'False', inline: true},
            {name: 'Timezone', value: inviterTimezone, inline: true},
            {name: 'Github', value: `https://github.com/${inviterGithub}`, inline: true},
            {name: 'Twitter', value: `https://twitter.com/${inviterTwitter}`, inline: true},
        )
    
        pages.push(embedMessage)   
    }

}