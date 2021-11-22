import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { supabase } from '../database';

export const data = new SlashCommandBuilder()
  .setName('unavailable')
  .setDescription('Set your status as unavailable for pairing')

export async function execute(interaction: CommandInteraction) {
    const { error } = await supabase
    .from('developers')
    .update({ 
        available: false,
        goal: null,     
    }).eq('discord', interaction.user.tag)
    
    if (error != null) {
        await interaction.reply({
            content: 'Something went wrong.',
            ephemeral: true,
        }); 

        return
    }

    await interaction.reply({
        content: 'Successfully updated status to unavailable!',
        ephemeral: true,
    });
}