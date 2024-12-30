const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const AutoRole = require("../../models/AutoRole");

module.exports = {
  run: async ({ client, interaction }) => {
    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case "configure":
        if (!interaction.inGuild()) {
          interaction.reply("This command can only be used in a server.");
          return;
        }

        const targetRoleId = interaction.options.get("role").value;

        try {
          await interaction.deferReply();

          let query = {
            guildId: interaction.guild.id,
          };

          let autoRole = await AutoRole.findOne(query);

          if (autoRole) {
            if (autoRole.roleId === targetRoleId) {
              interaction.editReply(
                "The auto-role feature is already configured for that role. To disable it, use the `/autorole disable` command."
              );
              return;
            }

            autoRole.roleId = targetRoleId;
          } else {
            autoRole = new AutoRole({ ...query, roleId: targetRoleId });
          }

          await autoRole.save();
          interaction.editReply(
            `The auto-role feature has been configured successfully! New members will now receive the specified role. \nTo disable this feature, use the \`/autorole disable\` command.`
          );
        } catch (error) {
          console.log("🪲 Có biến ở AutoRole rồi Đại vương ơi: ", error);
        }
        break;

      case "disable":
        try {
          await interaction.deferReply();

          let query = {
            guildId: interaction.guild.id,
          };

          if (!(await AutoRole.exists(query))) {
            interaction.editReply(
              "The auto-role feature is not enabled for this server. To enable it, use the `/autorole configure` command to configure it."
            );
            return;
          }

          await AutoRole.findOneAndDelete(query);

          interaction.editReply(
            `The auto-role feature has been disabled successfully! New members will no longer receive the specified role. \nTo re-enable this feature, use the \`/autorole configure\` command.`
          );
        } catch (error) {
          console.log("🪲 Có biến ở AutoRole rồi Đại vương ơi: ", error);
        }
        break;

      default:
        interaction.reply("Invalid subcommand.");
        break;
    }
  },

  data: new SlashCommandBuilder()
    .setName("autorole")
    .setDescription("Automatically assign a role to new members.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("configure")
        .setDescription("Configure the auto-role feature for your server.")
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("The role to be assigned to new members.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("disable")
        .setDescription("Disable the auto-role feature for your server.")
    ),

  permissionsRequired: [PermissionFlagsBits.Administrator],
  botPermissions: [PermissionFlagsBits.ManageRoles],

  //   deleled: true,
};
