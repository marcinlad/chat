import User from "./schema/User.js";

export async function handleUser(username) {
  const user = await User.findOne({ name: username });
  if (!user) {
    await User.create({ name: username, createdAt: new Date() });
  }
}