const { Client, Message } = require("discord.js");
const Level = require("../../models/Level");
const calculateLevelXp = require("../../utils/calculateLevelXp");
const { set } = require("mongoose");
const cooldown = new Set();

function getRandomXp(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 *
 * @param {Client} client
 * @param {Message} message
 */

module.exports = async (client, message) => {
  if (
    !message.inGuild() ||
    message.author.bot ||
    cooldown.has(message.author.id)
  )
    return;

  const xpToGive = getRandomXp(5, 15);

  const query = {
    userId: message.author.id,
    guildId: message.guild.id,
  };

  try {
    const level = await Level.findOne(query);

    if (level) {
      level.xp += xpToGive;

      if (level.xp > calculateLevelXp(level.level)) {
        level.xp = 0;
        level.level += 1;

        message.channel.send(
          `Congrats ${message.author}, you leveled up to level ${level.level}!`
        );
      }

      await level.save().catch((err) => {
        console.log("An error occurred while saving the level: ", err);
        return;
      });

      cooldown.add(message.author.id);
      setTimeout(() => {
        cooldown.delete(message.author.id);
      }, 60000);
    }

    //If the user doesn't have a level
    else {
      //Create a new level for the user
      const newLevel = new Level({
        userId: message.author.id,
        guildId: message.guild.id,
        xp: xpToGive,
      });

      await newLevel.save().catch((err) => {
        console.log("An error occurred while saving the new level: ", err);
        return;
      });

      cooldown.add(message.author.id);
      setTimeout(() => {
        cooldown.delete(message.author.id);
      }, 60000);
    }
  } catch (error) {
    console.log("An error occurred while giving xp to the user: ", error);
  }
};
