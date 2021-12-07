import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { supabase } from '../database';
import { generateDevelopersPaginator } from '../components/developersPaginator';
let AsciiTable = require('ascii-table')

export const data = new SlashCommandBuilder()
    .setName('developers')
    .setDescription('developers')
    .addSubcommand(subcommand => 
        subcommand.setName('all')
        .setDescription('List all developers')
    )
    .addSubcommand(subcommand => 
        subcommand.setName('available')
        .setDescription('List all available developers')
    )

export async function execute(interaction: CommandInteraction) {
    const {options} = interaction;
    const filterAvailable = options.getSubcommand() === 'available';

    const { data, error } = await supabase
    .from('developers')
    .select()
    .filter('available', 'in', filterAvailable ? '(true)':'(true,false)')

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