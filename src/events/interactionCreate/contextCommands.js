module.exports = (interaction, client) => {
  if (
    !interaction.isMessageContextMenuCommand() &&
    !interaction.isUserContextMenuCommand()
  )
    return;

  if (interaction.commandName === "User's infomation") {
    const targetUser = interaction.targetUser;
    interaction.reply(
      `User's tag: ${targetUser.tag}\nUser's ID: ${targetUser.id}`
    );
  } else if (interaction.commandName === "Translate message") {
    const targetMessage = interaction.targetMessage;
    interaction.reply(
      `Message's content: ${targetMessage}\nMessage's ID: ${interaction.targetId}`
    );
  }
};
