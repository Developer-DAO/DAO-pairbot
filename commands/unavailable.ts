import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { supabase } from '../database';

export const data = new SlashCommandBuilder()
  .setName('unavailable')
  .setDescription('Set your status as unavailable for pairing')

export async function execute(interaction: CommandInteraction) {
    const error = await supabase
    .from('developers')
    .update({ 
        available: false,
        goal: null,     
    }).eq('discord_id', interaction.user.id)
   
    let resultMessage = 'Successfully updated status to unavailable!';
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