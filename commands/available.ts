import { SlashCommandBuilder } from "@discordjs/builders";
import { supabase } from "../database";

export const AvailableCommand = {
  name: "available",
  commandJSON: () => {
    return new SlashCommandBuilder()
      .setName("available")
      .setDescription("Set your status as available for pairing")
      .addStringOption((option) =>
        option
          .setRequired(true)
          .setName("goal")
          .setDescription("What you would like to work on together?")
      );
  },
  execute: async (interaction: any) => {
    const { options } = interaction;
    const error = await supabase
      .from("developers")
      .update({
        available: true,
        ...(options.getString("goal") != null && {
          goal: options.getString("goal"),
        }),
      })
      .eq("discord_id", interaction.user.id);

    let resultMessage = "Successfully updated status to available!";
    if (error.status == 404) {
      resultMessage =
        "You are not in the pairing database! \nPlease use the **/add** command, set skills and desired skills to add yourself to the database!";
    } else if (error.error) {
      resultMessage = "Something went wrong.";
    }

    await interaction.reply({
      content: resultMessage,
      ephemeral: true,
    });
  },
};
