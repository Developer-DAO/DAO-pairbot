import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { supabase } from '../database';
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

    // create developer table
    let developerTable = new AsciiTable('Developers')
    developerTable
        .setHeading('', 'Discord', 'Available', 'Goal')  

    // loop through the data and add developer to table
    for (let i = 0; i < data!.length; i++) {
        const {discord, available, goal} = data![i];
        developerTable.addRow(i, discord, available, goal ? goal : "none");
    }

    // convert table into a codeblock
    const message = "\n ```" + developerTable.toString() + "```";

    await interaction.reply({
        content: message,
        ephemeral: true,
    });   
}