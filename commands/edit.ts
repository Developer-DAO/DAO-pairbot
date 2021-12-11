import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { supabase } from '../database';

export const data = new SlashCommandBuilder()
  .setName('edit')
  .setDescription('Edit your profile.')
  .addStringOption(option => option.setName('skills').setDescription('Enter your skills'))
  .addStringOption(option => option.setName('desired-skills').setDescription('Enter your desired skills')) 
  .addStringOption(option => option.setName('timezone').setDescription('Enter your timezone'))
  .addStringOption(option => option.setName('twitter').setDescription('Enter Twitter handle'))
  .addStringOption(option => option.setName('github').setDescription('Enter Github handle'))


export async function execute(interaction: CommandInteraction) {
    const { options } = interaction;  
    const { error } = await supabase
    .from('developers')
    .update({ 
        ...(options.getString('skills') != null && {skills: options.getString('skills')}),
        ...(options.getString('desired-skills') != null && {desired_skills: options.getString('desired-skills')}),
        ...(options.getString('timezone') != null && {timezone: options.getString('timezone')}),
        ...(options.getString('twitter') != null && {twitter: options.getString('twitter')}),
        ...(options.getString('github') != null && {github: options.getString('github')}),     
    }).eq('discord_id', interaction.user.id)
    
    if (error != null) {
        await interaction.reply({
            content: 'Something went wrong.',
            ephemeral: true,
        }); 

        return
    }

    await interaction.reply({
        content: 'Successfully updated!',
        ephemeral: true,
    });
}