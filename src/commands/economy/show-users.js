const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ActionRowBuilder,
  ComponentType,
  UserSelectMenuBuilder,
} = require("discord.js");

const data = new SlashCommandBuilder()
  .setName("show-users")
  .setDescription("Show users using user select menu.");

/**
 *
 * @param {Object} param0
 * @param {ChatInputCommandInteraction} param0.interaction
 */
async function run({ interaction }) {
  const userMenu = new UserSelectMenuBuilder()
    .setCustomId(interaction.id)
    .setPlaceholder("Select a channel...")
    .setMinValues(0)
    .setMaxValues(5);

  const actionRow = new ActionRowBuilder().addComponents(userMenu);

  const reply = await interaction.reply({
    content: "Choose a user from the select menu.",
    components: [actionRow],
  });

  const collector = reply.createMessageComponentCollector({
    componentType: ComponentType.UserSelect,
    filter: (i) =>
      i.user.id === interaction.user.id && i.customId === interaction.id,
    time: 60_000,
  });

  collector.on("collect", (interaction) => {
    if (!interaction.values.length) {
      interaction.reply("No user selected.");
      return;
    }

    interaction.reply(
      `You selected the following users: ${interaction.values.join(", ")}`
    );
  });
}

module.exports = {
  data,
  run,
};
