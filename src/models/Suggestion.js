const { Schema, model } = require("mongoose");
const { randomUUID } = require("crypto");

const SuggestionSchema = new Schema(
  {
    suggestionId: {
      type: String,
      default: randomUUID,
      required: true,
    },
    authorId: {
      type: String,
      required: true,
    },
    guildId: {
      type: String,
      required: true,
    },
    messageId: {
      type: String,
      required: true,
      unique: true,
    },
    content: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      // pending, approved, rejected
      default: "pending",
    },
    upvotes: {
      type: [String],
      default: [],
    },
    downvotes: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = model("Suggestion", SuggestionSchema);
