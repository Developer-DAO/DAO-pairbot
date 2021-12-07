import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { supabase } from "../database";
import { createDeveloperEmbed } from '../components/developerEmbed';

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

    //Become available if not
    if (!inviterData![0].available) {
        const { error: updateError } = await supabase
        .from('developers')
        .update({ available: true })
        .eq('discord_id', interaction.user.id)

        if (updateError == null) {
            await interaction.editReply({
                content: 'Something went wrong.',
            }); 
            return;
        }
    }

    // Checking invited developer availability
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

    //Invited not in the developers table
    if (data?.length === 0) {
        await interaction.editReply({
            content: 'The developer is not in the pairing sheet.',
        });
        return;
    }

    if (!data![0].available) {
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
    
    if (invitedError != null) {
        await interaction.editReply({
            content: 'Something went wrong.',
        }); 
        return;
    }
    
    if (alreadyInvited!.length !== 0) {
        await interaction.editReply({
            content: 'User already invited.',
        });
        return;
    }

    const inviterProfile = createDeveloperEmbed(interaction.user?.avatarURL()!, inviterData![0])

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
