import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageActionRow, MessageButton, MessageSelectMenu } from "discord.js";
import { supabase } from "../database";
import { createDeveloperEmbed } from "../components/developerEmbed";
import {
  constructExperienceMenu,
  constructSkillsMenu,
} from "../components/skills";
import { validateTwitterHandle, validateGithubHandle } from "../utils/";

export const AddCommand = {
  name: "add",
  commandJSON: () => {
    return new SlashCommandBuilder()
      .setName("add")
      .setDescription("Adds you to the developer pairing database.")
      .addStringOption((option) =>
        option
          .setRequired(true)
          .setName("timezone")
          .setDescription("Enter your timezone")
      )
      .addStringOption((option) =>
        option
          .setRequired(true)
          .setName("twitter")
          .setDescription("Enter Twitter handle")
      )
      .addStringOption((option) =>
        option
          .setRequired(true)
          .setName("github")
          .setDescription("Enter Github handle")
      );
  },
  execute: async (interaction: any) => {
    const { options } = interaction;

    const { data, error } = await supabase
      .from("developers")
      .select()
      .eq("discord_id", interaction.user?.id);

    if (error != null) {
      await interaction.reply({
        content: "Something went wrong.",
        ephemeral: true,
      });
      return;
    }
    if (data!.length > 0) {
      await interaction.reply({
        content: "You have already added yourself!",
        ephemeral: true,
      });
      return;
    }

    let skillList = constructSkillsMenu();
    let experienceList = constructExperienceMenu();

    const skillsMenu = new MessageSelectMenu()
      .setPlaceholder("Select your SKILLS!")
      .setOptions(skillList)
      .setCustomId("skills-list-filters")
      .setMinValues(1)
      .setMaxValues(skillList.length);

    const desiredSkillsMenu = new MessageSelectMenu()
      .setPlaceholder("Select your DESIRED SKILLS!")
      .setOptions(skillList)
      .setCustomId("desired-skills-list-filters")
      .setMinValues(1)
      .setMaxValues(skillList.length);

    const experienceLevelMenu = new MessageSelectMenu()
      .setPlaceholder("Select your EXPERIENCE LEVEL!")
      .setOptions(experienceList)
      .setCustomId("experience-level-list-filters")
      .setMinValues(1)
      .setMaxValues(1);

    const continueButton = new MessageButton()
      .setLabel("Continue")
      .setStyle("PRIMARY")
      .setCustomId("continue-button");

    const saveButton = new MessageButton()
      .setLabel("Save")
      .setStyle("SUCCESS")
      .setCustomId("save-button");

    let firstRow = new MessageActionRow().addComponents(skillsMenu);
    let secondRow = new MessageActionRow().addComponents(desiredSkillsMenu);
    let thirdRow = new MessageActionRow().addComponents(continueButton);
    let components = [firstRow, secondRow, thirdRow];

    let experienceRow = new MessageActionRow().addComponents(
      experienceLevelMenu
    );
    let saveRow = new MessageActionRow().addComponents(saveButton);

    const message = await interaction.reply({
      content:
        "Please choose between: \n\n__First line__ are the **SKILLS** that you have\n__Second line__ are the **DESIRED SKILLS** that you seek!\n\n",
      components: components,
      ephemeral: true,
      fetchReply: true,
    });
    const filter = (i: any) =>
      i.customId === skillsMenu.customId ||
      i.customId === desiredSkillsMenu.customId ||
      i.customId === continueButton.customId ||
      i.customId === experienceLevelMenu.customId ||
      i.customId === saveButton.customId;

    const collector = await message.createMessageComponentCollector({
      filter,
      time: 60000,
    });

    let selectedSkills: any;
    let selectedDesiredSkills: any;
    let selectedExperienceLevel: any;

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
          case experienceLevelMenu.customId:
            selectedExperienceLevel = i.values;
            break;
        }
      }

      if (i.isButton()) {
        switch (i.customId) {
          case continueButton.customId:
            if (
              selectedSkills == undefined ||
              selectedDesiredSkills == undefined
            ) {
              //Did not select skills AND desired skills
              await interaction.editReply({
                content:
                  "You need to select skills and desired skills to be able to continue!",
                components: [],
                ephemeral: true,
              });
              return;
            }

            await interaction.editReply({
              content: "How do you feel about your level of **EXPERIENCE**?",
              components: [experienceRow, saveRow],
              ephemeral: true,
            });
            break;

          case saveButton.customId:
            collector.stop();
        }
      }
      await i.deferUpdate();
      collector.resetTimer();
    });

    collector.on("end", async () => {
      let resultMessage =
        "You have successfully added yourself! \nIf you want to become available to pair now, type **/available** !";
      if (!message.deleted) {
        if (selectedExperienceLevel == undefined) {
          //Did not select experience
          await interaction.editReply({
            content: "You need to select your experience level!",
            components: [experienceRow, saveRow],
            ephemeral: true,
          });
          return;
        }

        selectedSkills = selectedSkills.join(", ");
        selectedDesiredSkills = selectedDesiredSkills.join(", ");
        selectedExperienceLevel = selectedExperienceLevel[0];
        const { error } = await supabase.from("developers").insert([
          {
            discord_id: interaction.user.id,
            discord: interaction.user.tag,
            skills: selectedSkills,
            desired_skills: selectedDesiredSkills,
            experience: selectedExperienceLevel,
            timezone: options.getString("timezone"),
            twitter: validateTwitterHandle(options.getString("twitter")),
            github: validateGithubHandle(options.getString("github")),
          },
        ]);

        if (error != null) {
          resultMessage = "Something went wrong.";
          if (error.code === "22001") {
            resultMessage = "Value is too long.";
          }

          //Error
          await interaction.editReply({
            content: resultMessage,
            components: [],
            ephemeral: true,
          });
          return;
        }

        const user = {
          discord_id: interaction.user.id,
          discord: interaction.user.tag,
          skills: selectedSkills,
          desired_skills: selectedDesiredSkills,
          experience: selectedExperienceLevel,
          timezone: options.getString("timezone"),
          twitter: options.getString("twitter"),
          github: options.getString("github"),
        };

        //Successfully added!
        await interaction.editReply({
          content: resultMessage,
          embeds: [createDeveloperEmbed(interaction.user?.avatarURL()!, user)],
          components: [],
          ephemeral: true,
        });
        return;
      }

      await interaction.editReply({
        content: "Something went wrong.",
        components: [],
        ephemeral: true,
      });
      return;
    });
  },
};
