import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { supabase } from "../database";

export const data = new SlashCommandBuilder()
  .setName('invite')
  .setDescription('Invite a developer to pair up with.')
  .addUserOption(option => option.setRequired(true).setName('developer').setDescription(`Developer's discord tag`))


export async function execute(interaction: CommandInteraction) {
    const { options } = interaction;
    console.log(interaction.createdAt)
    if (options.getUser('developer')!.id === interaction.user.id) {
        await interaction.reply({
            content: "Can't invite yourself.",
            ephemeral: true,
        }); 

        return;
    }

    const { data, error } = await supabase
    .from('developers')
    .select()
    .eq('discord_id', options.getUser('developer')?.id)

    if (error != null) {
        await interaction.reply({
            content: 'Something went wrong.',
            ephemeral: true,
        }); 

        return;
    }

    const {available} = data![0]

    if (available === false) {
        await interaction.reply({
            content: 'The developer is not available.',
            ephemeral: true,
        }); 

        return;
    }

    const { data: inviterData, error: inviterError } = await supabase
    .from('developers')
    .select()
    .eq('discord_id', interaction.user?.id)

    if (inviterError != null) {
        await interaction.reply({
            content: 'Something went wrong.',
            ephemeral: true,
        }); 

        return
    }

    const { 
        timezone: inviterTimezone,
        discord: inviterDiscord, 
        skills:inviterSkills, 
        desired_skills: inviterDesiredSkills, 
        goal: inviterGoal,
        position: inviterPosition, 
        twitter: inviterTwitter, 
        github: inviterGithub,
        available: inviterAvailable } = inviterData![0]

    const inviterProfile = new MessageEmbed()
	.setColor('#0099ff')
	.setTitle(`${inviterDiscord.charAt(0).toUpperCase() + inviterDiscord.slice(1)}'s profile`)
	.setThumbnail(interaction.user?.avatarURL()!)
	.setDescription(inviterPosition)
    .addFields(
        {name: 'Skills', value: inviterSkills}, 
        {name: 'Desired Skills', value: inviterDesiredSkills},
        {name: 'Goal', value: inviterGoal ?? "none"},
        {name: 'Available', value: inviterAvailable ? 'True' : 'False', inline: true},
        {name: 'Timezone', value: inviterTimezone, inline: true},
        {name: 'Github', value: `https://github.com/${inviterGithub}`, inline: true},
        {name: 'Twitter', value: `https://twitter.com/${inviterTwitter}`, inline: true},
    )

    const acceptRow = new MessageActionRow()
    .addComponents(new MessageButton()
    .setCustomId(`accept-${interaction.user?.id}`)
    .setLabel('Accept').setStyle('SUCCESS'))
    
  
    
    options.getUser('developer')?.send({  
        content: `You have been invited to pair up with ${interaction.user.tag}`,
        embeds: [inviterProfile],
        components: [acceptRow],
    });
    
    await interaction.reply({
        content: `Successfully invited ${options.getUser('developer')?.tag}!`,
        ephemeral: true,
    });
}
