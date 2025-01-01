const Parser = require("rss-parser");
const NotificationConfig = require("../../models/NotificationConfig");

const parser = new Parser();

/**
 *
 * @param {import("discord.js").Client} client
 */

module.exports = (client) => {
  checkYoutube();
  setInterval(checkYoutube, 60_000);

  async function checkYoutube() {
    try {
      const notificationConfigs = await NotificationConfig.find();

      for (const notificationConfig of notificationConfigs) {
        const YOUTUBE_RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${notificationConfig.ytChannelId}`;

        const feed = await parser
          .parseURL(YOUTUBE_RSS_URL)
          .catch((error) => null);

        if (!feed?.items.length) continue;

        const lastestVid = feed.items[0];
        const lastCheckedVid = notificationConfig.lastCheckedVid;

        if (
          !lastCheckedVid ||
          (lastestVid.id.split(":")[2] !== lastCheckedVid.id &&
            new Date(lastestVid.pubDate) > new Date(lastCheckedVid.pubDate))
        ) {
          const targetGuild =
            client.guilds.cache.get(notificationConfig.guildId) ||
            (await client.guilds.fetch(notificationConfig.guildId));

          if (!targetGuild) {
            await notificationConfig.findOneAndDelete({
              _id: notificationConfig._id,
            });
            continue;
          }

          const targetChannel =
            targetGuild.channels.cache.get(
              notificationConfig.notificationChannelId
            ) ||
            (await targetGuild.channels.fetch(
              notificationConfig.notificationChannelId
            ));

          if (!targetChannel) {
            await NotificationConfig.findOneAndDelete({
              _id: notificationConfig._id,
            });
            continue;
          }

          notificationConfig.lastCheckedVid = {
            id: lastestVid.id.split(":")[2],
            pubDate: lastestVid.pubDate,
          };

          await notificationConfig
            .save()
            .then(() => {
              const targetMessage =
                notificationConfig.customMessage
                  ?.replace("{VIDEO_URL}", lastestVid.link)
                  ?.replace("{VIDEO_TITLE}", lastestVid.title)
                  ?.replace("{CHANNEL_NAME}", feed.title)
                  ?.replace("{CHANNEL_URL}", feed.link) ||
                `New video from ${feed.title}! ${lastestVid.link}`;

              targetChannel.send(targetMessage);
            })
            .catch((e) => null);
        }
      }
    } catch (error) {
      console.log(`Error in ${__filename} event: ${error}`);
    }
  }
};
