const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  ChatInputCommandInteraction,
} = require("discord.js");
const NotificationConfig = require("../../models/NotificationConfig");

/**
 *
 * @param {Object} param0
 * @param {ChatInputCommandInteraction} param0.interaction
 */
async function run({ interaction }) {
  try {
    await interaction.deferReply({ ephemeral: true });

    const targetYtChannelId =
      interaction.options.getString("youtube-channel-id");
    const targetNotificationChannel =
      interaction.options.getChannel("target-channel");

    let query = {
      ytChannelId: targetYtChannelId,
      notificationChannelId: targetNotificationChannel.id,
    };

    const targetChannel = await NotificationConfig.findOne(query);

    if (!targetChannel) {
      interaction.followUp(
        "That youtube channel is not setup for that channel."
      );
      return;
    }

    NotificationConfig.deleteOne(query)
      .then(() => {
        interaction.followUp("Turned off notifications for that channel.");
      })
      .catch((error) => {
        interaction.followUp("There was an error turning off notifications.");
      });
  } catch (error) {
    console.log(`Error in ${__filename} command: ${error}`);
  }
}

const data = new SlashCommandBuilder()
  .setName("notification-remove")
  .setDescription("Turn off notifications for a youtube channel.")
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addStringOption((option) =>
    option
      .setName("youtube-channel-id")
      .setDescription("The ID of the youtube channel.")
      .setRequired(true)
  )
  .addChannelOption((option) =>
    option
      .setName("target-channel")
      .setDescription("The channel to turn off notification.")
      .setRequired(true)
      .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
  );

module.exports = {
  data,
  run,
};
