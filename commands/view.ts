import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, Message, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import { supabase } from '../database';

export const data = new SlashCommandBuilder()
  .setName('view')
  .setDescription("View a developer's profile")
  .addUserOption(option => option.setRequired(true).setName('developer').setDescription("Developer's Discord Tag"))

export async function execute(interaction: CommandInteraction) {
    const { options } = interaction;  
    
    const { data, error } = await supabase
    .from('developers')
    .select()
    .eq('discord_id', options.getUser('developer')?.id)

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

    // Checking if the person has already been invited
    const { data: alreadyInvited, error: invitedError } = await supabase
    .from('invites')
    .select()
    .eq('sender_discord_id', interaction.user.id)
    .eq('receiver_discord_id', options.getUser('developer')?.id)
    
    if (invitedError != null) {
        await interaction.editReply({
            content: 'Something went wrong.',
        }); 
        return;
    }

    const { timezone, discord, skills, desired_skills, goal, position, twitter, github, available } = data![0]

    const developerProfile = new MessageEmbed()
	.setColor('#0099ff')
	.setTitle(`${discord.charAt(0).toUpperCase() + discord.slice(1)}'s profile`)
	.setThumbnail(options.getUser('developer')?.avatarURL()!)
	.setDescription(position)
    .addFields(
        {name: 'Skills', value: skills}, 
        {name: 'Desired Skills', value: desired_skills},
        {name: 'Goal', value: goal ?? "none"},
        {name: 'Available', value: available ? 'True' : 'False', inline: true},
        {name: '\u200b', value: '\u200b', inline: true},
        {name: 'Timezone', value: timezone, inline: true},
        {name: 'Github', value: `__[github.com/${github}](https://github.com/${github})__`, inline: true},
        {name: 'Twitter', value: `__[twitter.com/${twitter}](https://twitter.com/${twitter})__`, inline: true},
    )

    const inviteRow = new MessageActionRow()
    .addComponents(new MessageButton()
    .setCustomId('invite')
    .setLabel('Invite').setStyle('SUCCESS')
    .setDisabled(!available || alreadyInvited!.length !== 0))

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
    
    const acceptButton = new MessageButton()
    .setCustomId(`accept`)
    .setLabel('Accept').setStyle('SUCCESS')
    const declineButton = new MessageButton()
    .setCustomId(`decline`)
    .setLabel('Decline').setStyle('DANGER')
    const buttonRow = new MessageActionRow()
    .addComponents([acceptButton, declineButton])
    
    const buttonSelected = buttonReply.customId;
    
    if (buttonSelected === 'invite') {
        const inviteMessage = options.getUser('developer')?.send({  
            content: `You have been invited to pair up with ${interaction.user.tag}`,
            embeds: [inviterProfile],
            components: [buttonRow],
        });

        // Recording the invite in the 'invites' table
        const { error: insertError } = await supabase
        .from('invites')
        .insert([{
            message_id: (await inviteMessage)?.id,
            sender_discord_id: interaction.user.id,
            receiver_discord_id: options.getUser('developer')!.id,
            created_at: interaction.createdAt,
        }])

        if (insertError != null) {
            await interaction.editReply({
                content: 'Something went wrong.',
            }); 

            return
        }

        await buttonReply.reply({
            content: `Successfully invited ${discord}`,
            ephemeral: true,
        });
    }
    
}