const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  AttachmentBuilder,
} = require("discord.js");
const Level = require("../../models/Level");
const calculateLevelXp = require("../../utils/calculateLevelXp");
const { RankCardBuilder, Font } = require("canvacord");

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */

  callback: async (client, interaction) => {
    if (!interaction.inGuild()) {
      interaction.reply("This command can only be used in a server");
      return;
    }

    await interaction.deferReply();

    const mentionedUserId = interaction.options.get("target-user")?.value;
    const targetUserId = mentionedUserId || interaction.member.id;
    const targetUserObject = await interaction.guild.members.fetch(
      targetUserId
    );

    const fetchedLevel = await Level.findOne({
      userId: targetUserId,
      guildId: interaction.guild.id,
    });

    if (!fetchedLevel) {
      interaction.editReply(
        mentionedUserId
          ? `${targetUserObject.user.tag} doesn't have any level yet. Please try again when they chat a bit.`
          : `You don't have any level yet. Please chat a little more to gain some levels and try again.`
      );
      return;
    }

    let allLevels = await Level.find({ guildId: interaction.guild.id }).select(
      "-_id userId level xp"
    );

    allLevels.sort((a, b) => {
      if (a.level === b.level) {
        return b.xp - a.xp;
      } else {
        return b.level - a.level;
      }
    });

    let currentRank =
      allLevels.findIndex((lvl) => lvl.userId === targetUserId) + 1;

    Font.loadDefault();

    const rankCard = new RankCardBuilder()
      .setDisplayName(targetUserObject.displayName)
      .setUsername(targetUserObject.user.username)
      .setAvatar(targetUserObject.user.displayAvatarURL({ format: "png" }))
      .setCurrentXP(fetchedLevel.xp)
      .setRequiredXP(calculateLevelXp(fetchedLevel.level + 1))
      .setLevel(fetchedLevel.level)
      .setRank(currentRank)
      .setOverlay(80)
      .setBackground("#23272a")
      .setStatus(targetUserObject.presence.status || "offline");

    const data = await rankCard.build({ format: "png" });
    const attachment = new AttachmentBuilder(data, { name: "rank.png" });

    interaction.editReply({
      files: [attachment],
    });
  },

  name: "level",
  description: "Check your or someone's level.",
  options: [
    {
      name: "target-user",
      description: "The user you want to check the level of",
      type: ApplicationCommandOptionType.Mentionable,
    },
  ],
};
