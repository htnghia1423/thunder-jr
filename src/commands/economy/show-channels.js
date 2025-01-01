const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ActionRowBuilder,
  ComponentType,
  ChannelSelectMenuBuilder,
  ChannelType,
} = require("discord.js");

const data = new SlashCommandBuilder()
  .setName("show-channels")
  .setDescription("Show channels using channel select menu.");

/**
 *
 * @param {Object} param0
 * @param {ChatInputCommandInteraction} param0.interaction
 */
async function run({ interaction }) {
  const channelMenu = new ChannelSelectMenuBuilder()
    .setCustomId(interaction.id)
    .setPlaceholder("Select a channel...")
    .setMinValues(0)
    .setMaxValues(5)
    .setChannelTypes(ChannelType.GuildText);

  const actionRow = new ActionRowBuilder().addComponents(channelMenu);

  const reply = await interaction.reply({
    content: "Choose a channel from the select menu.",
    components: [actionRow],
  });

  const collector = reply.createMessageComponentCollector({
    componentType: ComponentType.ChannelSelect,
    filter: (i) =>
      i.user.id === interaction.user.id && i.customId === interaction.id,
    time: 60_000,
  });

  collector.on("collect", (interaction) => {
    if (!interaction.values.length) {
      interaction.reply("No channel selected.");
      return;
    }

    interaction.reply(
      `You selected the following channels: ${interaction.values.join(", ")}`
    );
  });
}

module.exports = {
  data,
  run,
};
