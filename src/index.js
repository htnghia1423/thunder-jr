require("dotenv").config();
const {
  Client,
  IntentsBitField,
  EmbedBuilder,
  ActivityType,
} = require("discord.js");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

let status = [
  {
    name: "Mẹ mày",
    type: ActivityType.Playing,
    url: "https://www.youtube.com/watch?v=FXqxKSYPY-o",
  },
  {
    name: "Mẹ mày",
    type: ActivityType.Streaming,
    url: "https://www.youtube.com/watch?v=FXqxKSYPY-o",
  },
  {
    name: "Mẹ mày",
    type: ActivityType.Watching,
    url: "https://www.youtube.com/watch?v=FXqxKSYPY-o",
  },
];

client.on("ready", () => {
  console.log(`${client.user.tag} đã thức tỉnh!`);

  setInterval(() => {
    let randomStatus = status[Math.floor(Math.random() * status.length)];
    client.user.setActivity(randomStatus);
  }, 10000);
});

//Rep tin nhắn cố định từ user
client.on("messageCreate", (message) => {
  if (message.author.bot) return;
  if (message.content === "hello") {
    message.reply("Chào anh yêu🥰");
  }
});

//Interact với các lệnh từ user
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  switch (interaction.commandName) {
    case "ping":
      interaction.reply("Pong!");
      break;
    case "hello":
      interaction.reply("Chào anh yêu🥰");
      break;
    case "add":
      const num1 = interaction.options.getNumber("num1");
      const num2 = interaction.options.getNumber("num2");
      interaction.reply(`The sum is ${num1 + num2}`);
      break;
    case "embed":
      const embed = new EmbedBuilder()
        .setTitle("ThundeR STorM")
        .setDescription("Xin chào, tôi là đệ của Sấm⚡")
        .setColor("Random")
        .addFields(
          {
            name: "Ưu điểm",
            value: "Láo",
            inline: true,
          },
          {
            name: "Nhược điểm",
            value: "Lười",
            inline: true,
          }
        )
        .setFooter({
          text: "Chào các con vợ!",
          iconURL:
            "https://scontent.fsgn2-11.fna.fbcdn.net/v/t39.30808-1/457031275_1623559424876817_7373961573867684639_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=105&ccb=1-7&_nc_sid=0ecb9b&_nc_eui2=AeE1sWPA8ZFd9HKiUAM63xvbJgzkKyYWVWUmDOQrJhZVZX4SB0Se696QueMQG3ZGFkzm-lZgOpBp5i2ROdKUJZNG&_nc_ohc=pNeQDPBypNsQ7kNvgEkJ1Ki&_nc_zt=24&_nc_ht=scontent.fsgn2-11.fna&_nc_gid=A2ilkpNL5NkPaxR3Xvx8pxx&oh=00_AYC2lnxexUJ6CKpfcFXQIhS5v0-9y5b8Sd015EGcEWkrBw&oe=676026AB",
        })
        .setTimestamp()
        .setURL("https://github.com/htnghia1423")
        .setImage("https://avatars.githubusercontent.com/u/137130942?v=4")
        .setAuthor({
          name: "ThundeR",
          iconURL:
            "https://scontent.fsgn2-11.fna.fbcdn.net/v/t39.30808-1/457031275_1623559424876817_7373961573867684639_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=105&ccb=1-7&_nc_sid=0ecb9b&_nc_eui2=AeE1sWPA8ZFd9HKiUAM63xvbJgzkKyYWVWUmDOQrJhZVZX4SB0Se696QueMQG3ZGFkzm-lZgOpBp5i2ROdKUJZNG&_nc_ohc=pNeQDPBypNsQ7kNvgEkJ1Ki&_nc_zt=24&_nc_ht=scontent.fsgn2-11.fna&_nc_gid=A2ilkpNL5NkPaxR3Xvx8pxx&oh=00_AYC2lnxexUJ6CKpfcFXQIhS5v0-9y5b8Sd015EGcEWkrBw&oe=676026AB",
          url: "https://github.com/htnghia1423",
        })
        .setThumbnail(
          "https://cdn.discordapp.com/avatars/681854326238740491/fd3c48dde010644f7476d6a19e961ac4.webp?size=100"
        );
      interaction.reply({ embeds: [embed] });
      break;
  }
});

client.login(process.env.DISCORD_TOKEN);
