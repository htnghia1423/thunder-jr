module.exports = ({ interaction, commandObj }) => {
  if (commandObj.botPermissions?.length) {
    for (const permission of commandObj.botPermissions) {
      const bot = interaction.guild.members.me;
      if (!bot.permissions.has(permission)) {
        interaction.reply({
          content: "I do not have permission to use this command!",
          ephemeral: true,
        });
        return;
      }
    }
  }
};
