const { Schema, model } = require("mongoose");

const GuildConfigurationSchema = new Schema({
  guildId: {
    type: String,
    required: true,
  },
  suggestionsChannelIds: {
    type: [String],
    default: [],
    required: true,
  },
});

module.exports = model("GuildConfiguration", GuildConfigurationSchema);
