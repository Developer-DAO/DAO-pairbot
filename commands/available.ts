import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { supabase } from '../database';

export const data = new SlashCommandBuilder()
  .setName('available')
  .setDescription('Set your status as available for pairing')
  .addStringOption(option => option.setName('goal').setDescription('What you would like to work on together.'))


export async function execute(interaction: CommandInteraction) {
    const { options } = interaction;  
    const { error } = await supabase
    .from('developers')
    .update({ 
        available: true,
        ...(options.getString('goal') != null && {goal: options.getString('goal')}),     
    }).eq('discord', interaction.user.tag)
    
    if (error != null) {
        await interaction.reply({
            content: 'Something went wrong.',
            ephemeral: true,
        }); 

        return
    }

    await interaction.reply({
        content: 'Successfully updated status to available!',
        ephemeral: true,
    });
}