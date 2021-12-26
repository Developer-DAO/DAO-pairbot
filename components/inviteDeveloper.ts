import { MessageActionRow, MessageButton, MessageComponentInteraction, TextChannel } from "discord.js";
import { client } from "..";
import { supabase } from "../database";
import { createDeveloperEmbed } from "./developerEmbed";

export async function inviteDeveloper(interaction: any, options: any, inviterData: any) {
/*
  interaction: interaction through /view or /invite command 
  options: interaction with the buttons to invite in the /view or /invite replies
  inviterData: inviter record from the supabase DB

  DMs and channel messages are set up in order to invite someone even if they refuse DMs  
*/
    const INVITE_WAITTIME = 6000000;

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
    
    //Inviter becomes available if not
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

    //Showing inviter embed in invited DM
    const inviterProfile = createDeveloperEmbed(interaction.user?.avatarURL()!, inviterData![0])

    let acceptButton = new MessageButton()
    .setCustomId(`dm-invite-accept-` + interaction.id)
    .setLabel('Accept').setStyle('SUCCESS')
    let declineButton = new MessageButton()
    .setCustomId(`dm-invite-decline-` + interaction.id)
    .setLabel('Decline').setStyle('DANGER')

    let buttonRow = new MessageActionRow()
    .addComponents([acceptButton, declineButton])
  
    // Sends DM to user
    options.getUser('developer')?.send({          
        content: `You have been invited to pair up with ${interaction.user.tag}`,
        embeds: [inviterProfile],
        components: [buttonRow],
    }).then(async (dm: any) => {
        let dmContent = `Successfully invited ${options.getUser('developer')?.tag}!`;
        await interaction.editReply({
            content: dmContent,
        });
        
        // Recording the invite in the 'invites' table
        const { error: insertError } = await supabase
        .from('invites')
        .insert([{
            message_id: dm.id,
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

        const filter = (i: any) => 
        i.customId === acceptButton.customId ||
        i.customId === declineButton.customId;

        //Update the message based on user click of accept/decline
        dm.awaitMessageComponent({ filter, time: INVITE_WAITTIME })
        .then((i: MessageComponentInteraction) => {
            if (i.customId === acceptButton.customId) {
                dmContent += '\n\nEDIT: The invite has been **ACCEPTED**! :partying_face: :partying_face: '
            } else {
                dmContent += '\n\nEDIT: The invite has been **DECLINED**!';
            }
            interaction.editReply({ content: dmContent });
        })
        .catch(() => interaction.editReply({ content: 'Something went wrong.' }));

    }).catch(async (error: any) => {
        //50007 = User doesnt accept DMs in the server
        if (error.code != 50007) {
            await interaction.editReply({
                content: 'Something went wrong.',
            }); 
            return;
        }

        let channelMsgContent = `Hello <@${options.getUser('developer')?.id}>, you've been invited to pair with <@${interaction.user?.id}>!`;
        acceptButton.setCustomId(`channel-invite-accept-` + interaction.id);
        declineButton.setCustomId(`channel-invite-decline-` + interaction.id);

        let buttonRow = new MessageActionRow()
        .addComponents([acceptButton, declineButton])

        const channelMsg = await (client.channels?.cache.get(process.env.DISCORD_CHANNEL_ID?? '') as TextChannel).send({
            content: channelMsgContent,
            components: [buttonRow],
        });

        // Recording the invite in the 'invites' table
        const { data: d, error: insertError } = await supabase
        .from('invites')
        .insert([{
            message_id: channelMsg.id,
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

        const filter = (i: any) => {
        i.deferUpdate();
        return (i.customId === acceptButton.customId ||
        i.customId === declineButton.customId) &&
        i.user.id === options.getUser('developer')!.id;
        }
        
        const collector = channelMsg.createMessageComponentCollector({
            filter,
            time: INVITE_WAITTIME,
        })
        collector.on("collect", async (i: MessageComponentInteraction) => {
            switch (i.customId) {
                case acceptButton.customId:
                    
                    await channelMsg.edit({
                        content: channelMsgContent + '\n\nEDIT: The invite has been **ACCEPTED**! :partying_face: :partying_face: ',
                        components: []
                    });
                    await interaction.editReply({
                        content: `${options.getUser('developer')?.tag} has **ACCEPTED** your pairing invite! :partying_face: `,
                    }); 
                    break;

                case declineButton.customId:

                    await channelMsg.edit({
                        content: channelMsgContent + '\n\nEDIT: The invite has been **DECLINED**.',
                        components: []
                    });
                    await interaction.editReply({
                        content: `${options.getUser('developer')?.tag} has **DECLINED** your pairing invite.`,
                    });
                    break;
            }
            collector.stop();
        });
    
        collector.on("end", async () => {
            if (!channelMsg.deleted) {

                //If time expired and no buttons have been clicked, disable them
                if (channelMsg.components.length) {
                    channelMsg.edit({ components: [new MessageActionRow().addComponents(
                        new MessageButton()
                        .setCustomId(`dm-invite-accept-` + interaction.id)
                        .setLabel('Accept').setStyle('SUCCESS').setDisabled(true),
                        new MessageButton()
                        .setCustomId(`dm-invite-decline-` + interaction.id)
                        .setLabel('Decline').setStyle('DANGER').setDisabled(true))]
                    })
                }
            }
        });
    });
}