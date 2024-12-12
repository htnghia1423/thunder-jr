require("dotenv").config();
const {
  Client,
  IntentsBitField,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

roles = [
  {
    id: "1316588802126647356",
    label: "Nam",
  },
  {
    id: "1316588541773480027",
    label: "Nữ",
  },
  {
    id: "1316588888617390151",
    label: "Gay",
  },
];

client.on("ready", async () => {
  try {
    console.log(`${client.user.tag} đã thức tỉnh!`);
    const channel = await client.channels.cache.get("1035344649361051708");
    if (!channel) return console.error("Channel not found");

    const row = new ActionRowBuilder();
    roles.forEach((role) => {
      row.components.push(
        new ButtonBuilder()
          .setCustomId(role.id)
          .setLabel(role.label)
          .setStyle(ButtonStyle.Primary)
      );
    });

    await channel.send({
      content: "Chọn giới tính của bạn",
      components: [row],
    });
  } catch (error) {
    console.log(error);
  }
});

client.on("interactionCreate", async (interaction) => {
  try {
    if (!interaction.isButton()) return;
    await interaction.deferReply({ ephemeral: true });

    const role = interaction.guild.roles.cache.get(interaction.customId);
    if (!role) {
      interaction.editReply("Role not found");
      return;
    }

    const hasRole = interaction.member.roles.cache.has(role.id);
    if (hasRole) {
      await interaction.member.roles.remove(role);
      interaction.editReply(`Removed ${role.name}`);
      return;
    }

    await interaction.member.roles.add(role);
    await interaction.editReply(`Added ${role.name}`);
  } catch (error) {
    console.log(error);
  }
});

client.login(process.env.DISCORD_TOKEN);
