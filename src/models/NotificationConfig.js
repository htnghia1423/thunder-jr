const { Schema, model } = require("mongoose");

const NotificationConfigSchema = new Schema(
  {
    guildId: {
      type: String,
      required: true,
    },
    notificationChannelId: {
      type: String,
      required: true,
    },
    ytChannelId: {
      type: String,
      required: true,
    },
    customMeassage: {
      type: String,
    },
    lastChecked: {
      type: Date,
      required: true,
    },
    lastCheckedVid: {
      id: {
        type: String,
        required: true,
      },
      pubDate: {
        type: Date,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("NotificationConfig", NotificationConfigSchema);
