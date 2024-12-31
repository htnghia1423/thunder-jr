const {
  SlashCommandBuilder,
  ChannelType,
  ChatInputCommandInteraction,
} = require("discord.js");
const GuildConfiguration = require("../../models/GuildConfiguration");

module.exports = {
  /**
   *
   * @param {Object} param0
   * @param {ChatInputCommandInteraction} param0.interaction
   */
  run: async ({ interaction }) => {
    let query = {
      guildId: interaction.guildId,
    };
    let guildConfiguration = await GuildConfiguration.findOne(query);

    if (!guildConfiguration) {
      guildConfiguration = new GuildConfiguration(query);
    }

    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case "add":
        const addChannel = interaction.options.getChannel("channel");

        if (guildConfiguration.suggestionsChannelIds.includes(addChannel.id)) {
          await interaction.reply({
            content: `The channel <#${addChannel.id}> is already a suggestion channel.`,
            ephemeral: true,
          });
          return;
        }

        guildConfiguration.suggestionsChannelIds.push(addChannel.id);
        await guildConfiguration.save();

        await interaction.reply(
          `The channel <#${addChannel.id}> has been added as a suggestion channel.`
        );

        break;

      case "remove":
        const removeChannel = interaction.options.getChannel("channel");

        if (
          !guildConfiguration.suggestionsChannelIds.includes(removeChannel.id)
        ) {
          await interaction.reply({
            content: `The channel <#${removeChannel.id}> is not a suggestion channel.`,
            ephemeral: true,
          });
          return;
        }

        guildConfiguration.suggestionsChannelIds =
          guildConfiguration.suggestionsChannelIds.filter(
            (id) => id !== removeChannel.id
          );

        await guildConfiguration.save();

        await interaction.reply(
          `The channel <#${removeChannel.id}> has been removed as a suggestion channel.`
        );

        break;
    }
  },

  options: {
    userPermissions: ["Administrator"],
  },

  data: new SlashCommandBuilder()
    .setName("config-suggestions")
    .setDescription("Configure the suggestions system.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Add a suggestion channel.")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("The channel to add.")
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Remove a suggestion channel.")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("The channel to remove.")
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
    ),
};
