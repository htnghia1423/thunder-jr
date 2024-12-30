const { Client, GuildMember } = require("discord.js");
const AutoRole = require("../../models/AutoRole");

/**
 *
 * @param {Client} client
 * @param {GuildMember} member
 */

module.exports = async (member, client) => {
  try {
    let guild = member.guild;
    if (!guild) return;

    let query = {
      guildId: guild.id,
    };

    const autoRole = await AutoRole.findOne(query);
    if (!autoRole) return;

    await member.roles.add(autoRole.roleId);
  } catch (error) {
    console.log("🪲 Có biến ở AutoRole rồi Đại vương ơi: ", error);
  }
};
