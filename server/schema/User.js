import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  createdAt: Date,
});

export default mongoose.model("User", userSchema);
