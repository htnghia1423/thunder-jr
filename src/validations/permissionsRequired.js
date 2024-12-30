module.exports = (interaction, commandObj) => {
  if (commandObj.permissionsRquired?.lenght) {
    for (const permission of commandObj.permissionsRquired) {
      if (!interaction.member.permissions.has(permission)) {
        interaction.reply({
          content: "You do not have permission to use this command!",
          ephemeral: true,
        });
        return;
      }
    }
  }
};
