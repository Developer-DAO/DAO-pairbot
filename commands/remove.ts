import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { supabase } from '../database';

export const data = new SlashCommandBuilder()
  .setName('remove')
  .setDescription('Removes you from the  developer pairing database.')
  .addBooleanOption(option => option.setRequired(true).setName('confirm').setDescription('Are you sure you would like to remove yourself?'))


export async function execute(interaction: CommandInteraction) {   
    const { error } = await supabase
    .from('developers')
    .delete()
    .eq('discord_id', interaction.user.id)


    if (error != null) {
        await interaction.reply({
            content: 'Something went wrong.',
            ephemeral: true,
        }); 
        
        return
    }

    await interaction.reply({
        content: 'Successfully removed!',
        ephemeral: true,
    });
}