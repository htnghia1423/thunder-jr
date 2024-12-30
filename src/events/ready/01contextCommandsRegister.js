require("dotenv/config");
const {
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  REST,
  Routes,
} = require("discord.js");
const { clientId } = require("../../../config.json");

const commandsData = [
  new ContextMenuCommandBuilder()
    .setName("User's infomation")
    .setType(ApplicationCommandType.User),

  new ContextMenuCommandBuilder()
    .setName("Translate message")
    .setType(ApplicationCommandType.Message),
];

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

module.exports = async (client) => {
  try {
    console.log("Started refreshing context menu commands.");

    await rest.put(Routes.applicationCommands(clientId), {
      body: commandsData,
    });

    console.log("Successfully registered context menu commands.");
  } catch (error) {
    console.log("🪲 Có biến ở contextCommands rồi Đại vương ơi: ", error);
  }
};
