require("dotenv").config();
const { Client, IntentsBitField, EmbedBuilder } = require("discord.js");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on("ready", () => {
  console.log(`${client.user.tag} đã thức tỉnh!`);
});

// client.on("messageCreate", (message) => {
//   if (message.author.bot) return;
//   if (message.content === "hello") {
//     message.reply("hello");
//   }
// });

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  switch (interaction.commandName) {
    case "ping":
      interaction.reply("Pong!");
      break;
    case "hello":
      interaction.reply("Hey!");
      break;
    case "add":
      const num1 = interaction.options.getNumber("num1");
      const num2 = interaction.options.getNumber("num2");
      interaction.reply(`The sum is ${num1 + num2}`);
      break;
    case "embed":
      const embed = new EmbedBuilder()
        .setTitle("A slick little embed")
        .setDescription("Hello, this is a slick embed!")
        .setColor("Random")
        .addFields(
          {
            name: "Field 1",
            value: "Hello world!",
            inline: true,
          },
          {
            name: "Field 2",
            value: "Hello world!",
            inline: true,
          }
        );
      interaction.reply({ embeds: [embed] });
      break;
  }
});

client.login(process.env.DISCORD_TOKEN);
