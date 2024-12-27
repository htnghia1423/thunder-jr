const { Client, Interaction } = require("discord.js");
const User = require("../../models/User");

const dailyAmount = 1000;

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    if (!interaction.inGuild()) {
      interaction.reply({
        content: "This command can only be used in a server!",
        ephemeral: true,
      });
      return;
    }

    try {
      await interaction.deferReply();

      let query = {
        userId: interaction.member.id,
        guildId: interaction.guild.id,
      };

      let user = await User.findOne(query);

      if (user) {
        const lastDailyDate = user.lastDaily.toDateString();
        const currentDate = new Date().toDateString();

        if (lastDailyDate === currentDate) {
          await interaction.editReply(
            "You have already claimed your daily reward today! Come back tomorrow!"
          );
          return;
        }
      } else {
        user = new User({ ...query, lastDaily: new Date() });
      }

      user.balance += dailyAmount;
      await user.save();

      interaction.editReply(
        `You have claimed your daily reward of **${dailyAmount}** coins! Your new balance is **${user.balance}** coins.`
      );
    } catch (error) {
      console.log("🪲 Có biến ở Daily rồi Đại vương ơi: ", error);
    }
  },

  name: "daily",
  description: "Get your daily reward!",
};
