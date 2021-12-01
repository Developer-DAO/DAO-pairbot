import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { supabase } from "../database";

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
            content: "Can't invite yourself."
        }); 

        return;
    }

    // Fetching invited developer
    const { data, error } = await supabase
    .from('developers')
    .select()
    .eq('discord_id', options.getUser('developer')?.id)

    if (error != null) {
        await interaction.editReply({
            content: 'Something went wrong.',
        }); 

        return;
    }

    const {available} = data![0]

    if (available === false) {
        await interaction.editReply({
            content: 'The developer is not available.',
        }); 

        return;
    }

    // Checking if the person has already been invited
    const { data: alreadyInvited, error: invitedError } = await supabase
    .from('invites')
    .select()
    .eq('sender_discord_id', interaction.user.id)
    .eq('receiver_discord_id', options.getUser('developer')?.id)

  
    if (alreadyInvited!.length !== 0) {
        await interaction.editReply({
            content: `${options.getUser('developer')?.tag} already invited.`,
        });
        return;
    }
    
    if (invitedError != null) {
        await interaction.editReply({
            content: 'Something went wrong.',
        }); 
        return;
    }

 
    // Getting the inviter's record
    const { data: inviterData, error: inviterError } = await supabase
    .from('developers')
    .select()
    .eq('discord_id', interaction.user?.id)

    if (inviterError != null) {
        await interaction.editReply({
            content: 'Something went wrong.',
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
  
    // Sends private message to user
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

    await interaction.editReply({
        content: `Successfully invited ${options.getUser('developer')?.tag}!`,
    });
}
