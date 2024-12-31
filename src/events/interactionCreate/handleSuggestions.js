const { Interaction } = require("discord.js");
const Suggestion = require("../../models/Suggestion");
const formatResults = require("../../utils/formatResults");

/**
 *
 * @param {Interaction} interaction
 */

module.exports = async (interaction) => {
  if (!interaction.isButton() || !interaction.customId) return;

  try {
    const [type, suggestionId, action] = interaction.customId.split(".");

    if (!type || !suggestionId || !action) return;
    if (type !== "suggestion") return;

    await interaction.deferReply({ ephemeral: true });

    let query = {
      suggestionId,
    };

    const targetSuggestion = await Suggestion.findOne(query);

    if (!targetSuggestion) {
      await interaction.editReply({
        content: "Suggestion not found.",
        ephemeral: true,
      });
      return;
    }

    const targetMessage = await interaction.channel.messages.fetch(
      targetSuggestion.messageId
    );
    const targetMessageEmbed = targetMessage.embeds[0];

    const hasVoted =
      targetSuggestion.upvotes.includes(interaction.user.id) ||
      targetSuggestion.downvotes.includes(interaction.user.id);

    switch (action) {
      case "approve":
        if (!interaction.memberPermissions.has("Administrator")) {
          await interaction.editReply({
            content: "You do not have permission to approve suggestions.",
            ephemeral: true,
          });
          return;
        }

        targetSuggestion.status = "approved";

        targetMessageEmbed.data.color = 0x84e660;
        targetMessageEmbed.fields[1].value = "✅ Approved";

        await targetSuggestion.save();

        interaction.editReply({
          content: "Suggestion approved.",
        });

        targetMessage.edit({
          embeds: [targetMessageEmbed],
          components: [targetMessage.components[0]],
        });
        break;

      case "reject":
        if (!interaction.memberPermissions.has("Administrator")) {
          await interaction.editReply({
            content: "You do not have permission to reject suggestions.",
            ephemeral: true,
          });
          return;
        }

        targetSuggestion.status = "rejected";

        targetMessageEmbed.data.color = 0xff6161;
        targetMessageEmbed.fields[1].value = "❌ Rejected";

        await targetSuggestion.save();

        interaction.editReply({
          content: "Suggestion rejected.",
        });

        targetMessage.edit({
          embeds: [targetMessageEmbed],
          components: [targetMessage.components[0]],
        });
        break;

      case "upvote":
        if (hasVoted) {
          await interaction.editReply({
            content: "You have already voted on this suggestion.",
            ephemeral: true,
          });
          return;
        }

        targetSuggestion.upvotes.push(interaction.user.id);

        await targetSuggestion.save();

        await interaction.editReply({
          content: "You have upvoted the suggestion.",
        });

        targetMessageEmbed.fields[2].value = formatResults(
          targetSuggestion.upvotes,
          targetSuggestion.downvotes
        );

        targetMessage.edit({
          embeds: [targetMessageEmbed],
        });
        break;

      case "downvote":
        if (hasVoted) {
          await interaction.editReply({
            content: "You have already voted on this suggestion.",
            ephemeral: true,
          });
          return;
        }

        targetSuggestion.downvotes.push(interaction.user.id);

        await targetSuggestion.save();

        await interaction.editReply({
          content: "You have downvoted the suggestion.",
        });

        targetMessageEmbed.fields[2].value = formatResults(
          targetSuggestion.upvotes,
          targetSuggestion.downvotes
        );

        targetMessage.edit({
          embeds: [targetMessageEmbed],
        });
        break;

      default:
        await interaction.editReply({
          content: "Invalid action.",
          ephemeral: true,
        });
        break;
    }
  } catch (error) {
    console.log("Error handling suggestion:", error);
    await interaction.editReply({
      content: "An error occurred while handling the suggestion.",
      ephemeral: true,
    });
  }
};
