import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from "discord.js";
import { supabase } from "../database";
import { inviteDeveloper } from '../components/inviteDeveloper';

export const data = new SlashCommandBuilder()
  .setName('invite')
  .setDescription('Invite a developer to pair up with.')
  .addUserOption(option => option.setRequired(true).setName('developer').setDescription(`Developer's discord tag`))


export async function execute(interaction: CommandInteraction) {
    const { options } = interaction;

    await interaction.reply({
        content: `Busy inviting ${options.getUser('developer')?.tag}...`,
        ephemeral: true
    });

    // Can't invite yourself
    if (options.getUser('developer')!.id === interaction.user.id) {
        await interaction.editReply({
            content: "Can't invite yourself.",
        }); 

        return;
    }

    console.log('SSSSSSSSSSSSS')
    //Checking inviter
    const { data: inviterData, error: inviterError } = await supabase
    .from('developers')
    .select()
    .eq('discord_id', interaction.user.id)

    if (inviterError != null) {
        await interaction.editReply({
            content: 'Something went wrong.',
        }); 
        return;
    }

    //Inviter not in the developers table
    if (inviterData?.length === 0) {
        await interaction.editReply({
            content: '/Add yourself and make yourself /available before inviting someone to pair with you!',
        });
        return;
    }

    await inviteDeveloper(interaction, options, inviterData);
}
