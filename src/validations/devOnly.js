const { devs } = require("../../config.json");

module.exports = (interaction, commandObj) => {
  if (commandObj.devOnly) {
    if (!devs.includes(interaction.user.id)) {
      interaction.reply({
        content: "This command is only available to the developer.",
        ephemeral: true,
      });
      return true;
    }
  }
};
