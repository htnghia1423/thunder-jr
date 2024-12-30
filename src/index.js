require("dotenv/config");
const { Client, IntentsBitField } = require("discord.js");
const { CommandHandler } = require("djs-commander");
const path = require("path");
const { testServer } = require("../config.json");
const mongoose = require("mongoose");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildPresences,
    IntentsBitField.Flags.MessageContent,
  ],
});

(async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    new CommandHandler({
      client,
      commandsPath: path.join(__dirname, "commands"),
      eventsPath: path.join(__dirname, "events"),
      validationsPath: path.join(__dirname, "validations"),
      testServer,
    });

    client.login(process.env.DISCORD_TOKEN);
  } catch (error) {
    console.log("Error connecting to MongoDB: ", error);
  }
})();
