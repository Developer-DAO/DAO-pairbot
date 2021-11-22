import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, Message, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import { supabase } from '../database';

export const data = new SlashCommandBuilder()
  .setName('view')
  .setDescription("View a developer's profile")
  .addUserOption(option => option.setRequired(true).setName('developer').setDescription("Developer's Name"))

export async function execute(interaction: CommandInteraction) {
    const { options } = interaction;  
    
    const { data, error } = await supabase
    .from('developers')
    .select()
    .eq('discord', options.getUser('developer')?.tag)

    if (error != null) {
        await interaction.reply({
            content: 'Something went wrong.',
            ephemeral: true,
        }); 

        return
    }

    if (data!.length === 0) {
        await interaction.reply({
            content: 'User not found in the pairing database.',
            ephemeral: true,
        })

        return
    }

    const { name, timezone, discord, skills, desired_skills, goal, position, twitter, github, available } = data![0]

    const developerProfile = new MessageEmbed()
	.setColor('#0099ff')
	.setTitle(`${name.charAt(0).toUpperCase() + name.slice(1)}'s profile`)
	.setThumbnail(options.getUser('developer')?.avatarURL()!)
	.setDescription(position)
    .addFields(
        {name: 'Skills', value: skills}, 
        {name: 'Desired Skills', value: desired_skills},
        {name: 'Goal', value: goal ?? "none"},
        {name: 'Available', value: available ? 'True' : 'False', inline: true},
        {name: 'Timezone', value: timezone, inline: true},
        {name: 'Discord', value: discord, inline:true},
        {name: 'Github', value: `https://github.com/${github}`, inline: true},
        {name: 'Twitter', value: `https://twitter.com/${twitter}`, inline: true},
    )

    const inviteRow = new MessageActionRow()
    .addComponents(new MessageButton()
    .setCustomId('invite')
    .setLabel('Invite').setStyle('SUCCESS')
    .setDisabled(!available))

    await interaction.reply({
        embeds: [developerProfile],
        components: options.getUser('developer')!.id !== interaction.user.id ? [inviteRow] : [],
        ephemeral: true,
    });

    const interactionMessage = await interaction.fetchReply();

    if (!(interactionMessage instanceof Message)) { return; }
  
    const buttonReply = await interactionMessage.awaitMessageComponent({ componentType: 'BUTTON' });
    
    if (!buttonReply) {
      return;
    }
    const { data: inviterData, error: inviterError } = await supabase
    .from('developers')
    .select()
    .eq('discord', interaction.user?.tag)
  
    if (inviterError != null) {
        await interaction.reply({
            content: 'Something went wrong.',
            ephemeral: true,
        }); 

        return
    }

    const { 
        name: inviterName, 
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
	.setTitle(`${inviterName.charAt(0).toUpperCase() + inviterName.slice(1)}'s profile`)
	.setThumbnail(interaction.user?.avatarURL()!)
	.setDescription(inviterPosition)
    .addFields(
        {name: 'Skills', value: inviterSkills}, 
        {name: 'Desired Skills', value: inviterDesiredSkills},
        {name: 'Goal', value: inviterGoal ?? "none"},
        {name: 'Available', value: inviterAvailable ? 'True' : 'False', inline: true},
        {name: 'Timezone', value: inviterTimezone, inline: true},
        {name: 'Discord', value: inviterDiscord, inline:true},
        {name: 'Github', value: `https://github.com/${inviterGithub}`, inline: true},
        {name: 'Twitter', value: `https://twitter.com/${inviterTwitter}`, inline: true},
    )
    
    const acceptRow = new MessageActionRow()
    .addComponents(new MessageButton()
    .setCustomId(`accept-${interaction.user?.id}`)
    .setLabel('Accept').setStyle('SUCCESS'))
    
    const buttonSelected = buttonReply.customId;

    if (buttonSelected === 'invite') {
        options.getUser('developer')?.send({  
            content: `You have been invited to pair up with ${interaction.user.tag}`,
            embeds: [inviterProfile],
            components: [acceptRow],
        });
    }
}