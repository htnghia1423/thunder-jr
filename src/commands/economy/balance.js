const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  Guild,
} = require("discord.js");
const User = require("../../models/User");

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    if (!interaction.inGuild()) {
      interaction.reply({
        content: "This command can only be used in a server.",
        ephemeral: true,
      });
      return;
    }

    const targetUserId =
      interaction.options.get("user")?.value || interaction.member.id;

    await interaction.deferReply();

    let query = {
      userId: targetUserId,
      guildId: interaction.guild.id,
    };
    const user = await User.findOne(query);

    if (!user) {
      interaction.editReply(`<@${targetUserId}> doesn't have an account yet.`);
      return;
    }

    const balanceUnit = user.balance === 1 ? "coin" : "coins";
    interaction.editReply(
      targetUserId === interaction.member.id
        ? `You have **${user.balance}** ${balanceUnit}.`
        : `<@${targetUserId}> has **${user.balance}** ${balanceUnit}.`
    );
  },

  name: "balance",
  description: "Check your or someone else's balance.",
  options: [
    {
      name: "user",
      description: "The user you want to check the balance of.",
      type: ApplicationCommandOptionType.User,
    },
  ],
};