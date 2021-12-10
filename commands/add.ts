import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageActionRow, MessageButton, MessageSelectMenu } from 'discord.js';
import { skills } from '../components/skills';
import { supabase } from '../database';
import { createDeveloperEmbed } from '../components/developerEmbed';
import { validateTwitterHandle, validateGithubHandle } from '../utils/'; 

export const data = new SlashCommandBuilder()
  .setName('add')
  .setDescription('Adds you to the developer pairing database.')
  .addStringOption(option => option.setRequired(true).setName('position').setDescription('Enter your current position'))
  .addStringOption(option => option.setRequired(true).setName('timezone').setDescription('Enter your timezone'))
  .addStringOption(option => option.setRequired(true).setName('twitter').setDescription('Enter Twitter handle'))
  .addStringOption(option => option.setRequired(true).setName('github').setDescription('Enter Github handle'))


export async function execute(interaction: any) {
    const { options } = interaction;  

    const { data, error } = await supabase
    .from('developers')
    .select()
    .eq('discord_id', interaction.user?.id)
  
    if (error != null) {
        await interaction.reply({
            content: 'Something went wrong.',
            ephemeral: true,
        }); 
        return;
    }
    if (data!.length > 0) {
        await interaction.reply({
            content: 'You have already added yourself!',
            ephemeral: true
        }); 
        return;
    }

    let skillList = _constructFilterOptions(skills);

    const skillsMenu = new MessageSelectMenu()
    .setPlaceholder('Select your SKILLS!')
    .setOptions(skillList)
    .setCustomId('skills-list-filters')
    .setMinValues(1)
    .setMaxValues(skillList.length);
    
    const desiredSkillsMenu = new MessageSelectMenu()
    .setPlaceholder('Select your DESIRED SKILLS!')
    .setOptions(skillList)
    .setCustomId('desired-skills-list-filters')
    .setMinValues(1)
    .setMaxValues(skillList.length);
    
    const saveButton = new MessageButton()
    .setLabel('Save')
    .setStyle('SUCCESS')
    .setCustomId('save-button');

    let firstRow = new MessageActionRow().addComponents(skillsMenu);
    let secondRow = new MessageActionRow().addComponents(desiredSkillsMenu);
    let thirdRow = new MessageActionRow().addComponents(saveButton)
    let components = [firstRow, secondRow, thirdRow]

    const message = await interaction.reply({
        content: 'Please choose between: \n\n__First line__ are the **SKILLS** that you have\n__Second line__ are the **DESIRED SKILLS** that you seek!\n\n',
        components: components,
        ephemeral: true,
        fetchReply: true
    });
    const filter = (i: any) => 
    i.customId === skillsMenu.customId ||
    i.customId === desiredSkillsMenu.customId ||
    i.customId === saveButton.customId;

    const collector = await message.createMessageComponentCollector({
        filter,
        time: 60000,
    })
    
    let selectedSkills: any;
    let selectedDesiredSkills: any;

    // Starts on listening for button component clicks
    collector.on("collect", async (i: any) => {

        if (i.isSelectMenu()) {
            switch (i.customId) {
                case desiredSkillsMenu.customId:
                    selectedDesiredSkills = i.values;
                    break;
                case skillsMenu.customId:
                    selectedSkills = i.values;
                    break;
            }
        }

        if (i.isButton()) {
            collector.stop()
        }
        await i.deferUpdate();
        collector.resetTimer();
    });

    collector.on("end", async () => {
        if (!message.deleted) {
            if (selectedSkills != undefined && selectedDesiredSkills != undefined) {

                selectedSkills = selectedSkills.join(', ');
                selectedDesiredSkills = selectedDesiredSkills.join(', ');
                const { error } = await supabase
                .from('developers')
                .insert([
                    {
                        discord_id: interaction.user.id,
                        discord: interaction.user.tag,
                        position: options.getString('position'),
                        skills: selectedSkills,
                        desired_skills: selectedDesiredSkills,
                        timezone: options.getString('timezone'),
                        twitter: validateTwitterHandle(options.getString('twitter')),
                        github: validateGithubHandle(options.getString('github'))
                    }
                ])
    
                if (error != null) {
                    var content = 'Something went wrong.';
                    if (error.code === '22001') {
                        content = 'Value is too long.'
                    }
                    
                    await interaction.editReply({
                        content: content,
                        components: [],
                        ephemeral: true,
                    }); 
                    return;
                }
                
                const user = {
                    discord_id: interaction.user.id,
                    discord: interaction.user.tag,
                    position: options.getString('position'),
                    skills: selectedSkills,
                    desired_skills: selectedDesiredSkills,
                    timezone: options.getString('timezone'),
                    twitter: options.getString('twitter'),
                    github: options.getString('github')
                }

                await interaction.editReply({
                    content: 'Successfully added!',
                    embeds: [createDeveloperEmbed(interaction.user?.avatarURL()!, user)],
                    components: [],
                    ephemeral: true,
                });
                return;

            } else {
                await interaction.editReply({
                    content: 'You need to select skills and desired skills to be able to save!',
                    components: [],
                    ephemeral: true,
                });
                return;
            }
        }
        await interaction.editReply({
            content: 'Something went wrong.',
            components: [],
            ephemeral: true,
        });
        return;
    });
}

function _constructFilterOptions(skills: any[]): any[] {
    const filterOptions: { label: string; description: string, value: string; }[] = [];
    
    skills.forEach((dict: any) => {     //Filters through skills
        for (let elem in dict) {     //Filters through the dictionary
            for (let skill in dict[elem].sort()) {      //Filters through the values of the dictionary
                filterOptions.push({
                    label: dict[elem][skill],
                    description: elem,
                    value: dict[elem][skill],
                })
            }
        }
    })
    return filterOptions;
}