const { Client, GatewayIntentBits } = require("discord.js");
const { testServer } = require("../../config.json");
require("dotenv").config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once("ready", async () => {
  try {
    // Fetch all application commands
    const applicationCommands = await client.application.commands.fetch({
      guildId: testServer,
    });

    // Delete each command
    for (const command of applicationCommands.values()) {
      await client.application.commands.delete(command.id, testServer);
      console.log(`🗑️ Deleted command: "${command.name}".`);
    }

    console.log("All commands have been deleted.");
  } catch (error) {
    console.log("🪲 Có biến khi xoá lệnh rồi Đại vương ơi: ", error);
  } finally {
    client.destroy();
  }
});

client.login(process.env.DISCORD_TOKEN);
