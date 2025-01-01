const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder,
  ComponentType,
} = require("discord.js");

const data = new SlashCommandBuilder()
  .setName("show-pets")
  .setDescription("Show pet using string select menu.");

/**
 *
 * @param {Object} param0
 * @param {ChatInputCommandInteraction} param0.interaction
 */
async function run({ interaction }) {
  const pets = [
    {
      label: "Dog",
      description: "This is a dog.",
      value: "dog",
      emoji: "🐶",
    },
    {
      label: "Cat",
      description: "This is a cat.",
      value: "cat",
      emoji: "🐱",
    },
  ];

  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId(interaction.id)
    .setPlaceholder("Select a pet...")
    .setMinValues(0)
    .setMaxValues(pets.length)
    .addOptions(
      pets.map((pet) =>
        new StringSelectMenuOptionBuilder()
          .setLabel(pet.label)
          .setDescription(pet.description)
          .setValue(pet.value)
          .setEmoji(pet.emoji)
      )
    );

  const actionRow = new ActionRowBuilder().addComponents(selectMenu);

  const reply = await interaction.reply({
    content: "Choose a pet from the select menu.",
    components: [actionRow],
  });

  const collector = reply.createMessageComponentCollector({
    componentType: ComponentType.StringSelect,
    filter: (i) =>
      i.user.id === interaction.user.id && i.customId === interaction.id,
    time: 60_000,
  });

  collector.on("collect", (interaction) => {
    if (!interaction.values.length) {
      interaction.reply("You didn't select any pets.");
      return;
    }

    interaction.reply(`You selected: ${interaction.values.join(", ")}`);
  });
}

module.exports = {
  data,
  run,
};
