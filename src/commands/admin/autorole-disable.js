const { Client, Interaction, PermissionFlagsBits } = require("discord.js");
const AutoRole = require("../../models/AutoRole");

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    try {
      await interaction.deferReply();

      let query = {
        guildId: interaction.guild.id,
      };

      if (!(await AutoRole.exists(query))) {
        interaction.editReply(
          "The auto-role feature is not enabled for this server. To enable it, use the `/autorole-configure` command to configure it."
        );
        return;
      }

      await AutoRole.findOneAndDelete(query);

      interaction.editReply(
        `The auto-role feature has been disabled successfully! New members will no longer receive the specified role. \nTo re-enable this feature, use the \`/autorole-configure\` command.`
      );
    } catch (error) {
      console.log("🪲 Có biến ở AutoRole rồi Đại vương ơi: ", error);
    }
  },

  name: "autorole-disable",
  description: "Disable the auto-role feature for your server.",

  permissionsRequired: [PermissionFlagsBits.Administrator],
};
