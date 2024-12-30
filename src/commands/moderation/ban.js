const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  run: async ({ interaction, client, handler }) => {
    const targetUserId = interaction.options.get("target-user").value;
    const reason =
      interaction.options.get("reason")?.value || "No reason provided.";

    await interaction.deferReply();

    const targetUser = await interaction.guild.members.fetch(targetUserId);

    if (!targetUser) {
      await interaction.editReply("That user is not in this server.");
      return;
    }

    if (targetUser.id === interaction.guild.ownerId) {
      await interaction.editReply("You cannot ban the server owner.");
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position; //Highest role position of the target user
    const requestUserRolePosition = interaction.member.roles.highest.position; //Highest role position of the user who requested the ban
    const botRolePosition = interaction.guild.members.me.roles.highest.position; //Highest role position of the bot

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply(
        "You cannot ban a member who has a higher or equal role position."
      );
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply(
        "I cannot ban a member who has a higher or equal role position than me."
      );
      return;
    }

    //Ban the user
    try {
      await targetUser.ban({ reason });
      await interaction.editReply(
        `Successfully banned ${targetUser}!\nReason: ${reason}`
      );
    } catch (error) {
      console.log("🪲 Có biến ở Banning rồi Đại vương ơi: ", error);
      await interaction.editReply(
        "There was an error trying to ban that user."
      );
    }
  },

  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a user from the server.")
    .addUserOption((option) =>
      option
        .setName("target-user")
        .setDescription("The user to ban.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("The reason for the ban.")
    ),

  options: {
    userPermissions: ["BanMembers"],
    botPermissions: ["BanMembers"],
    //   deleted: true,
  },
};
