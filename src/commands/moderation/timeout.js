const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");
const ms = require("ms");

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    const mentionable = interaction.options.get("target-user").value;
    const duration = interaction.options.get("duration").value;
    const reason =
      interaction.options.get("reason")?.value || "No reason provided.";

    await interaction.deferReply();

    const targetUser = await interaction.guild.members.fetch(mentionable);
    if (!targetUser) {
      await interaction.editReply("That user is not in this server.");
      return;
    }

    if (targetUser.user.bot) {
      await interaction.editReply("You cannot timeout a bot.");
      return;
    }

    const msDuration = ms(duration);
    if (isNaN(msDuration)) {
      await interaction.editReply("Please provide a valid timeout duration.");
      return;
    }

    if (msDuration < ms("1m") || msDuration > ms("1w")) {
      await interaction.editReply(
        "Timeout duration must be at least 1 minute. Maximum duration is 1 week."
      );
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position; //Highest role position of the target user
    const requestUserRolePosition = interaction.member.roles.highest.position; //Highest role position of the user who requested the timeout
    const botRolePosition = interaction.guild.members.me.roles.highest.position; //Highest role position of the bot

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply(
        "You cannot timeout a member who has a higher or equal role position."
      );
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply(
        "I cannot timeout a member who has a higher or equal role position than me."
      );
      return;
    }

    //Timeout user
    try {
      const { default: prettyMs } = await import("pretty-ms");

      if (targetUser.isCommunicationDisabled()) {
        await targetUser.timeout(msDuration, reason);
        await interaction.editReply(
          `${targetUser}'s timeout has been update to ${prettyMs(msDuration, {
            verbose: true,
          })}.\nReason: ${reason}`
        );
        return;
      }

      await targetUser.timeout(msDuration, reason);
      await interaction.editReply(
        `Successfully timed out ${targetUser} for ${prettyMs(msDuration, {
          verbose: true,
        })}.\nReason: ${reason}`
      );
    } catch (error) {
      console.log("🪲 Có biến ở Timming out rồi Đại vương ơi: ", error);
      await interaction.editReply(
        "There was an error trying to timeout that user."
      );
    }
  },

  name: "timeout",
  description: "Timeout a member from the server!",
  options: [
    {
      name: "target-user",
      description: "The user you want to timeout.",
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
    {
      name: "duration",
      description: "Timeout duration.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "reason",
      description: "The reason for timing out.",
      type: ApplicationCommandOptionType.String,
    },
  ],

  permissionsRequired: [PermissionFlagsBits.MuteMembers],
  botPermissions: [PermissionFlagsBits.MuteMembers],
};
