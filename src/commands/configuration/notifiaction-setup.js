const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  ChatInputCommandInteraction,
  EmbedBuilder,
} = require("discord.js");
const NotificationConfig = require("../../models/NotificationConfig");
const Parser = require("rss-parser");

const parser = new Parser();

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
    const targetCustomMessage = interaction.options.getString("custom-message");

    let query = {
      notificationChannelId: targetNotificationChannel.id,
      ytChannelId: targetYtChannelId,
    };

    const duplicateExist = await NotificationConfig.exists(query);

    if (duplicateExist) {
      interaction.followUp(
        `That youtube channel is already setup for that channel.\nRun \`/notification-remove\` to remove it.`
      );
      return;
    }

    const YOUTUBE_RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${targetYtChannelId}`;

    const feed = await parser.parseURL(YOUTUBE_RSS_URL).catch((error) => {
      interaction.followUp(
        "There was an error fetching the youtube channel. Ensure the channel ID is correct."
      );
    });

    if (!feed) return;

    const channelName = feed.title;

    const notificationConfig = new NotificationConfig({
      guildId: interaction.guild.id,
      notificationChannelId: targetNotificationChannel.id,
      ytChannelId: targetYtChannelId,
      customMeassage: targetCustomMessage,
      lastChecked: new Date(),
      lastCheckedVid: null,
    });

    if (feed.items.length) {
      const lastestVideo = feed.items[0];

      notificationConfig.lastCheckedVid = {
        id: lastestVideo.id.split(":")[2],
        pubDate: new Date(lastestVideo.pubDate),
      };
    }

    notificationConfig
      .save()
      .then(() => {
        const embed = new EmbedBuilder()
          .setTitle("✅ Youtube Channel Configuration Success!")
          .setDescription(
            `${targetNotificationChannel} will now receive notifications for ${channelName}.`
          )
          .setTimestamp();

        interaction.followUp({ embeds: [embed] });
      })
      .catch((error) => {
        interaction.followUp("Unexpected error occured. Please try again.");
      });
  } catch (error) {
    console.log("Error setting up notification: ", error);
  }
}

const data = new SlashCommandBuilder()
  .setName("notification-setup")
  .setDescription("Setup notification for a youtube channel.")
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
      .setDescription("The channel to send notification.")
      .setRequired(true)
      .addChannelTypes(ChannelType.GuildText)
  )
  .addStringOption((option) =>
    option
      .setName("custom-message")
      .setDescription(
        "Templates: {VIDEO_TITLE} {VIDEO_URL} {CHANNEL_NAME} {CHANNEL_URL}"
      )
  );

module.exports = {
  data,
  run,
};
