const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const GuildConfiguration = require("../../models/GuildConfiguration");
const Suggestion = require("../../models/Suggestion");
const formatResults = require("../../utils/formatResults");

module.exports = {
  /**
   *
   * @param {Object} param0
   * @param {ChatInputCommandInteraction} param0.interaction
   */
  run: async ({ interaction }) => {
    try {
      let query = {
        guildId: interaction.guildId,
      };

      const guildConfiguration = await GuildConfiguration.findOne(query);

      if (!guildConfiguration?.suggestionsChannelIds.length) {
        await interaction.reply({
          content: `This server does not have a suggestions channel set up yet.\nPlease ask a server administrator to set one up.`,
          ephemeral: true,
        });
      }

      if (
        !guildConfiguration.suggestionsChannelIds.includes(
          interaction.channelId
        )
      ) {
        await interaction.reply({
          content: `This channel is not configured as a suggestions channel.\nTry one of the following channels: ${guildConfiguration.suggestionsChannelIds
            .map((id) => `<#${id}>`)
            .join(", ")}`,
          ephemeral: true,
        });
        return;
      }

      const modal = new ModalBuilder()
        .setTitle("Create a suggestion")
        .setCustomId(`suggestion-create-${interaction.user.id}`);

      const textInput = new TextInputBuilder()
        .setCustomId("suggestion-input")
        .setLabel("What would you like to suggest?")
        .setPlaceholder("Enter your suggestion here.")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)
        .setMaxLength(1000);

      const actionRow = new ActionRowBuilder().addComponents(textInput);

      modal.addComponents(actionRow);

      await interaction.showModal(modal);

      const filter = (i) =>
        i.customId === `suggestion-create-${interaction.user.id}`;

      const modalInteraction = await interaction
        .awaitModalSubmit({
          filter,
          time: 1000 * 60 * 3,
        })
        .catch((error) => {
          console.log("Error awaiting modal submit", error);
        });

      await modalInteraction.deferReply({ ephemeral: true });

      let suggestionMessage;

      try {
        suggestionMessage = await interaction.channel.send(
          "Creating suggestion, please wait..."
        );
      } catch (error) {
        modalInteraction.editReply({
          content: `Failed to create suggestion in this channel. I may not have the required permissions.`,
        });
        return;
      }

      const suggestionText =
        modalInteraction.fields.getTextInputValue("suggestion-input");

      const newSuggestion = new Suggestion({
        authorId: interaction.user.id,
        guildId: interaction.guildId,
        messageId: suggestionMessage.id,
        content: suggestionText,
      });

      await newSuggestion.save();

      modalInteraction.editReply({
        content: `Suggestion created successfully!`,
      });

      //Suggestion embed
      const suggestionEmbed = new EmbedBuilder()
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL({ size: 256 }),
        })
        .addFields([
          {
            name: "Suggestion",
            value: suggestionText,
          },
          {
            name: "Status",
            value: "⏳ Pending",
          },
          {
            name: "Votes",
            value: formatResults(),
          },
        ])
        .setColor("Yellow");

      //Buttons
      const upvoteButton = new ButtonBuilder()
        .setEmoji("👍")
        .setLabel("Upvote")
        .setStyle(ButtonStyle.Primary)
        .setCustomId(`suggestion.${newSuggestion.suggestionId}.upvote`);

      const downvoteButton = new ButtonBuilder()
        .setEmoji("👎")
        .setLabel("Downvote")
        .setStyle(ButtonStyle.Primary)
        .setCustomId(`suggestion.${newSuggestion.suggestionId}.downvote`);

      const approveButton = new ButtonBuilder()
        .setEmoji("✅")
        .setLabel("Approve")
        .setStyle(ButtonStyle.Success)
        .setCustomId(`suggestion.${newSuggestion.suggestionId}.approve`);

      const rejectButton = new ButtonBuilder()
        .setEmoji("🗑️")
        .setLabel("Reject")
        .setStyle(ButtonStyle.Danger)
        .setCustomId(`suggestion.${newSuggestion.suggestionId}.reject`);

      //Rows
      const firstRow = new ActionRowBuilder().addComponents(
        upvoteButton,
        downvoteButton
      );
      const secondRow = new ActionRowBuilder().addComponents(
        approveButton,
        rejectButton
      );

      suggestionMessage.edit({
        content: `${interaction.user} Suggestion created!`,
        embeds: [suggestionEmbed],
        components: [firstRow, secondRow],
      });
    } catch (error) {
      console.error("Error creating suggestion", error);
      await interaction.reply({
        content: `An error occurred while creating the suggestion.`,
        ephemeral: true,
      });
    }
  },

  data: new SlashCommandBuilder()
    .setName("suggest")
    .setDescription("Create a suggestion!"),

  options: {
    // deleted: true,
  },
};
