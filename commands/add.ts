import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { supabase } from '../database';

export const data = new SlashCommandBuilder()
  .setName('add')
  .setDescription('Adds you to the developer pairing database.')
  .addStringOption(option => option.setRequired(true).setName('position').setDescription('Enter your current position'))
  .addStringOption(option => option.setRequired(true).setName('skills').setDescription('Enter your skills'))
  .addStringOption(option => option.setRequired(true).setName('desired-skills').setDescription('Enter your desired skills')) 
  .addStringOption(option => option.setRequired(true).setName('timezone').setDescription('Enter your timezone'))
  .addStringOption(option => option.setRequired(true).setName('twitter').setDescription('Enter Twitter handle'))
  .addStringOption(option => option.setRequired(true).setName('github').setDescription('Enter Github handle'))


export async function execute(interaction: CommandInteraction) {
    const { options } = interaction;  
    const { error } = await supabase
    .from('developers')
    .insert([
        {
            discord_id: interaction.user.id,
            discord: interaction.user.tag,
            position: options.getString('position'),
            skills: options.getString('skills'),
            desired_skills: options.getString('desired-skills'),
            timezone: options.getString('timezone'),
            twitter: options.getString('twitter'),
            github: options.getString('github')
        }
    ])

    if (error != null) {
        await interaction.reply({
            content: 'Something went wrong.',
            ephemeral: true,
        }); 

        return
    }

    await interaction.reply({
        content: 'Successfully added!',
        ephemeral: true,
    });
}
