const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  run: ({ interaction }) => {
    const subcommandGroup = interaction.options.getSubcommandGroup();
    const subcommand = interaction.options.getSubcommand();

    if (subcommandGroup === "user") {
      if (subcommand === "role") {
        const targetUser = interaction.options.getUser("target-user");
        const role = interaction.options.getRole("role");

        interaction.reply(`Configured ${targetUser} with role ${role}.`);
      }
    }
  },

  data: new SlashCommandBuilder()
    .setName("configure")
    .setDescription("Configure some stuff....")
    .addSubcommandGroup((subcommandGroup) =>
      subcommandGroup
        .setName("user")
        .setDescription("Configure a user.")
        .addSubcommand((subcommand) =>
          subcommand
            .setName("role")
            .setDescription("Configure a user's role.")
            .addUserOption((option) =>
              option
                .setName("target-user")
                .setDescription("The user you want to configure.")
                .setRequired(true)
            )
            .addRoleOption((option) =>
              option
                .setName("role")
                .setDescription("The role you want to give to the user.")
                .setRequired(true)
            )
        )
    ),

  options: {
    // deleted: true,
  },
};
