const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
} = require("discord.js");

const choices = [
  {
    name: "Rock",
    emoji: "🪨",
    beats: "Scissors",
  },
  {
    name: "Paper",
    emoji: "📄",
    beats: "Rock",
  },
  {
    name: "Scissors",
    emoji: "✂️",
    beats: "Paper",
  },
];

module.exports = {
  /**
   *
   * @param {Object} param0
   * @param {ChatInputCommandInteraction} param0.interaction
   */
  run: async ({ interaction }) => {
    try {
      const targetUser = interaction.options.getUser("user");

      if (interaction.user.id === targetUser.id) {
        interaction.reply({
          content: "You can't play rock, paper, scissors with yourself.",
          ephemeral: true,
        });
        return;
      }

      if (targetUser.bot) {
        interaction.reply({
          content: "You can't play rock, paper, scissors with a bot.",
          ephemeral: true,
        });
        return;
      }

      const embed = new EmbedBuilder()
        .setTitle("Rock, Paper, Scissors")
        .setDescription(
          `It's currently ${targetUser}'s turn. Please wait for them to make a choice.`
        )
        .setColor("Yellow")
        .setTimestamp(new Date());

      const buttons = choices.map((choice) => {
        return new ButtonBuilder()
          .setCustomId(choice.name)
          .setLabel(choice.name)
          .setStyle(ButtonStyle.Primary)
          .setEmoji(choice.emoji);
      });

      const row = new ActionRowBuilder().addComponents(buttons);

      const reply = await interaction.reply({
        content: `${targetUser}, you have been challenged to a game of rock, paper, scissors! by ${interaction.user}. To start the game, click on one of the buttons below.`,
        embeds: [embed],
        components: [row],
      });

      const targetUserInteraction = await reply
        .awaitMessageComponent({
          filter: (i) => i.user.id === targetUser.id,
          time: 30_000,
        })
        .catch(async (error) => {
          embed.setDescription(
            `${targetUser} did not respond in time. The game has been cancelled.`
          );
          await reply.edit({ embeds: [embed], components: [] });
        });

      if (!targetUserInteraction) return;

      const targetUserChoice = choices.find(
        (choice) => choice.name === targetUserInteraction.customId
      );

      await targetUserInteraction.reply({
        content: `You picked ${targetUserChoice.emoji} ${targetUserChoice.name}.`,
        ephemeral: true,
      });

      //Edit the embed with the updated user's turn
      embed.setDescription(
        `It's currently ${interaction.user}'s turn. Please make a choice.`
      );
      await reply.edit({
        content: `${interaction.user}, it's your turn.`,
        embeds: [embed],
      });

      const initialUserInteraction = await reply
        .awaitMessageComponent({
          filter: (i) => i.user.id === interaction.user.id,
          time: 30_000,
        })
        .catch(async (error) => {
          embed.setDescription(
            `${interaction.user} did not respond in time. The game has been cancelled.`
          );
          await reply.edit({ embeds: [embed], components: [] });
        });

      if (!initialUserInteraction) return;

      const initialUserChoice = choices.find(
        (choice) => choice.name === initialUserInteraction.customId
      );

      let result;

      if (targetUserChoice.beats === initialUserChoice.name) {
        result = `${targetUser} wins!`;
      }

      if (initialUserChoice.beats === targetUserChoice.name) {
        result = `${interaction.user} wins!`;
      }

      if (targetUserChoice.name === initialUserChoice.name) {
        result = "It's a tie!";
      }

      embed.setDescription(
        `${targetUser} picked ${targetUserChoice.emoji} ${targetUserChoice.name}.\n${interaction.user} picked ${initialUserChoice.emoji} ${initialUserChoice.name}.\n\n${result}`
      );

      reply.edit({ embeds: [embed], components: [] });
    } catch (error) {
      console.log("Error running rps command: ", error);
    }
  },

  data: new SlashCommandBuilder()
    .setName("rps")
    .setDescription("Play rock, paper, scissors with another user.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user you want to play against.")
        .setRequired(true)
    ),
};
