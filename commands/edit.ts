import { SlashCommandBuilder } from "@discordjs/builders";
import {
  MessageActionRow,
  MessageButton,
  MessageSelectMenu,
  MessageSelectOptionData,
} from "discord.js";
import {
  constructExperienceMenu,
  constructSkillsMenu,
} from "../components/skills";
import { supabase } from "../database";
import { validateGithubHandle, validateTwitterHandle } from "../utils";

export const EditCommand = {
  name: "edit",
  commandJSON: () => {
    return new SlashCommandBuilder()
      .setName("edit")
      .setDescription("Edit your profile.")
      .addSubcommand((subcommand) =>
        subcommand
          .setName("others")
          .setDescription("Edit your timezone or twitter or github")
          .addStringOption((option) =>
            option.setName("timezone").setDescription("Enter your timezone")
          )
          .addStringOption((option) =>
            option.setName("twitter").setDescription("Enter Twitter handle")
          )
          .addStringOption((option) =>
            option.setName("github").setDescription("Enter Github handle")
          )
      )
      .addSubcommand((subcommand) =>
        subcommand.setName("skills").setDescription("Edit your skills")
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName("desired_skills")
          .setDescription("Edit your desired-skills")
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName("experience")
          .setDescription("Edit your experience level")
      );
  },
  execute: async (interaction: any) => {
    const { options } = interaction;

    const saveButton = new MessageButton()
      .setLabel("Save")
      .setStyle("SUCCESS")
      .setCustomId("save-button");
    let firstRow, secondRow, filter;
    let resultMessage = "Successfully updated!";

    const command: string = options.getSubcommand();

    //If want to edit timezone/github/twitter
    if (command == "others") {
      const { error } = await supabase
        .from("developers")
        .update({
          ...(options.getString("timezone") != null && {
            timezone: options.getString("timezone"),
          }),
          ...(options.getString("twitter") != null && {
            twitter: validateTwitterHandle(options.getString("twitter")),
          }),
          ...(options.getString("github") != null && {
            github: validateGithubHandle(options.getString("github")),
          }),
        })
        .eq("discord_id", interaction.user.id);

      if (error != null) {
        resultMessage = "Something went wrong.";
      }

      await interaction.reply({
        content: resultMessage,
        ephemeral: true,
      });
      return;
    }

    //If want to edit experience/skills/desired skills
    let list: MessageSelectOptionData[] = [];
    switch (command) {
      case "skills" || "desired_skills":
        list = constructSkillsMenu();

      case "experience":
        list = constructExperienceMenu();
    }
    const menu = new MessageSelectMenu()
      .setPlaceholder(`Select your ${command.replace("_", " ")}!`)
      .setOptions(list)
      .setCustomId("menu-list-filters")
      .setMinValues(1)
      .setMaxValues(command === "experience" ? 1 : list.length);

    //Set what components to see
    firstRow = new MessageActionRow().addComponents(menu);
    secondRow = new MessageActionRow().addComponents(saveButton);

    filter = (i: any) =>
      i.customId === menu.customId || i.customId === saveButton.customId;

    let components = [firstRow, secondRow];

    const message = await interaction.reply({
      content: `Please *edit* your **${command
        .replace("_", " ")
        .toUpperCase()}**:`,
      components: components,
      ephemeral: true,
      fetchReply: true,
    });

    const collector = await message.createMessageComponentCollector({
      filter,
      time: 60000,
    });

    let selectedItems: any;

    // Starts on listening for button component clicks
    collector.on("collect", async (i: any) => {
      if (i.isSelectMenu()) {
        selectedItems = i.values;
        collector.resetTimer();
      }

      if (i.isButton()) {
        collector.stop();
      }
      await i.deferUpdate();
    });

    collector.on("end", async () => {
      if (!message.deleted) {
        if (selectedItems != undefined) {
          selectedItems =
            selectedItems.length > 1
              ? selectedItems.join(", ")
              : selectedItems[0];
          let toUpdate: any = {};
          toUpdate[command] = selectedItems;

          const error = await supabase
            .from("developers")
            .update(toUpdate)
            .eq("discord_id", interaction.user.id);

          //Error
          if (error.error != null) {
            resultMessage = "Something went wrong.";
            if (error.error.code === "22001") {
              resultMessage = "Value is too long.";
            } else if (error.status == 404) {
              resultMessage = "User not found!";
            }
          }
        } else {
          //Did not select anything from the dropdown
          resultMessage = `You need to select **${command}** to be able to save!`;
        }
        await interaction.editReply({
          content: resultMessage,
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
