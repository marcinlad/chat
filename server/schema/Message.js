import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  content: String,
  createdAt: Date,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

export default mongoose.model("Message", messageSchema);