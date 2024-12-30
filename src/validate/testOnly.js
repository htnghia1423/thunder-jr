const { testServer } = require("../../config.json");

module.exports = ({ interaction, commandObj }) => {
  if (commandObj.testOnly) {
    if (!(interaction.guild.id === testServer)) {
      interaction.reply({
        content: "This command can only be run in the test server!",
        ephemeral: true,
      });
      return true;
    }
  }
};
