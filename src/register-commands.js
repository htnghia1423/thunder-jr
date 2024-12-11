require("dotenv").config();
const { REST, Routes, ApplicationCommandOptionType } = require("discord.js");

const commands = [
  /**
  {
    name: "ping",
    description: "Replies with Pong!",
  },
  {
    name: "hello",
    description: "Replies with Hey!",
  },
  {
    name: "add",
    description: "Add two numbers",
    options: [
      {
        name: "num1",
        description: "The first number",
        type: ApplicationCommandOptionType.Number,
        required: true,
        choices: [
          {
            name: "One",
            value: 1,
          },
          {
            name: "Two",
            value: 2,
          },
          {
            name: "Three",
            value: 3,
          },
        ],
      },
      {
        name: "num2",
        description: "The second number",
        type: ApplicationCommandOptionType.Number,
        required: true,
      },
    ],
  }, 
  **/
  {
    name: "embed",
    description: "Send an embed message",
    
  },
];

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      {
        body: commands,
      }
    );
    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
})();
