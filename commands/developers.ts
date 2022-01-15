import { SlashCommandBuilder } from '@discordjs/builders';
import { supabase } from '../database';
import { generateDevelopersPaginator } from '../components/developersPaginator';

export const DevelopersCommand = {
    name: 'developers',
    commandJSON: () => {
        return new SlashCommandBuilder()
        .setName('developers')
        .setDescription('Show the developers in the database')
    },
    execute: async (interaction: any) => { 
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
}

