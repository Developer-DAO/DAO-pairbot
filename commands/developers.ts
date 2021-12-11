import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { supabase } from '../database';
import { generateDevelopersPaginator } from '../components/developersPaginator';

export const data = new SlashCommandBuilder()
    .setName('developers')
    .setDescription('Show the developers in the database')

export async function execute(interaction: CommandInteraction) {
    const {options} = interaction;

    const { data, error } = await supabase
    .from('developers')
    .select()

    if (error != null) {
        await interaction.reply({
            content: 'Something went wrong.',
            ephemeral: true,
        }); 

        return
    }
    
    //No developers
    if (data?.length === 0) {
        await interaction.reply({
            content: 'No developers found!',
            ephemeral: true,
        }); 

        return
    }

    //Create developer embed + pagination
    await generateDevelopersPaginator(interaction, data!);
}