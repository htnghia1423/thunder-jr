const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");
const AutoRole = require("../../models/AutoRole");

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
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
            "The auto-role feature is already configured for that role. To disable it, use the `/autorole-disable` command."
          );
          return;
        }

        autoRole.roleId = targetRoleId;
      } else {
        autoRole = new AutoRole({ ...query, roleId: targetRoleId });
      }

      await autoRole.save();
      interaction.editReply(
        `The auto-role feature has been configured successfully! New members will now receive the specified role. \nTo disable this feature, use the \`/autorole-disable\` command.`
      );
    } catch (error) {
      console.log("🪲 Có biến ở AutoRole rồi Đại vương ơi: ", error);
    }
  },

  name: "autorole-configure",
  description: "Configure the auto-role feature for your server.",
  options: [
    {
      name: "role",
      description: "The role to be assigned to new members.",
      type: ApplicationCommandOptionType.Role,
      required: true,
    },
  ],

  permissionsRequired: [PermissionFlagsBits.Administrator],
  botPermissions: [PermissionFlagsBits.ManageRoles],
};
