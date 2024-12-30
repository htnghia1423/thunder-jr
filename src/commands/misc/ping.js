const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  run: async ({ interaction }) => {
    await interaction.reply(
      `Pong! 🏓\nYour current ping is ${interaction.client.ws.ping}ms.`
    );
  },

  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),

  options: {
    devOnly: true,
    // deleted: true,
  },
};
