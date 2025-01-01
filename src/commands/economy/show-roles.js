const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ActionRowBuilder,
  ComponentType,
  RoleSelectMenuBuilder,
} = require("discord.js");

const data = new SlashCommandBuilder()
  .setName("show-roles")
  .setDescription("Show role using role select menu.");

/**
 *
 * @param {Object} param0
 * @param {ChatInputCommandInteraction} param0.interaction
 */
async function run({ interaction }) {
  const roleMenu = new RoleSelectMenuBuilder()
    .setCustomId(interaction.id)
    .setPlaceholder("Select a role...")
    .setMinValues(0)
    .setMaxValues(5);

  const actionRow = new ActionRowBuilder().addComponents(roleMenu);

  const reply = await interaction.reply({
    content: "Choose a role from the select menu.",
    components: [actionRow],
  });

  const collector = reply.createMessageComponentCollector({
    componentType: ComponentType.RoleSelect,
    filter: (i) =>
      i.user.id === interaction.user.id && i.customId === interaction.id,
    time: 60_000,
  });

  collector.on("collect", (interaction) => {
    if (!interaction.values.length) {
      interaction.reply("No role selected.");
      return;
    }

    interaction.reply(
      `You selected the following roles: ${interaction.values.join(", ")}`
    );
  });
}

module.exports = {
  data,
  run,
};
