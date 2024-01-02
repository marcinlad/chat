import User from "./schema/User.js";
import Message from "./schema/Message.js";

export async function saveMessage(username, message) {
  const user = await User.findOne({ name: username });
  if (!user) {
    console.log("User does not exist");
    return;
  }
  await Message.create({
    content: message,
    createdAt: new Date(),
    user: user._id,
  });
}

export async function getMessages() {
  const messages = await Message.find().populate("user");
  return messages.map((message) => {
    const { user, content, createdAt } = message;
    return {
      user: user.name,
      content,
      createdAt: createdAt.toLocaleTimeString(),
    };
  })
}

