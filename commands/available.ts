import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { supabase } from '../database';

export const data = new SlashCommandBuilder()
  .setName('available')
  .setDescription('Set your status as available for pairing')
  .addStringOption(option => option.setName('goal').setDescription('What you would like to work on together?'))


export async function execute(interaction: CommandInteraction) {
    const { options } = interaction;  
    const error = await supabase
    .from('developers')
    .update({ 
        available: true,
        ...(options.getString('goal') != null && {goal: options.getString('goal')}),     
    }).eq('discord_id', interaction.user.id)
    
    let resultMessage = 'Successfully updated status to available!';
    if (error.status == 404) {
        resultMessage = 'You are not in the pairing database! \nPlease use the **/add** command, set skills and desired skills to add yourself to the database!'
    } else if (error.error) {
        resultMessage = 'Something went wrong.';
    }

    await interaction.reply({
        content: resultMessage,
        ephemeral: true,
    });
}