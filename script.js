const ws = new WebSocket("ws://localhost:3001");

ws.addEventListener("message", (event) => {
  const data = JSON.parse(event.data);

  if (data.type === "message") {
      addMessage(data.data, data.user, data.date);
  }
});

window.addEventListener("unload", () => {
  ws.onclose = () => { };
  ws.close();
});

const loginForm = document.getElementById("login");
let login;

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  login = e.target.username.value;

  try {
    const res = await fetch("http://localhost:3000/login?username=" + login);
    const data = await res.json();
    if (!res.ok) {
      alert(data.error ?? "Something went wrong")
      return
    }

    data.forEach((message) => {
      addMessage(message.content, message.user, message.createdAt);
    });

    const chatRoom = document.getElementById("room");
    e.target.classList.add("hidden");
    chatRoom.classList.remove("hidden");
  } catch (err) {
    console.error(err);
  }
})

const chatForm = document.getElementById("chat-form");
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const message = e.target.message.value;

  sendMessage(message);
});

function sendMessage(message) {
  if (!message) return false;

  ws.send(JSON.stringify({ type: "message", data: message, user: login }));

  addMessage(message);
  document.getElementById("message").value = "";
}

function addMessage(message, username = login, msgDate = null) {
  const node = document.createElement("P");
  const date = document.createElement("span");
  date.classList.add("text-gray-500", "text-xs", "w-full", "inline-block");
  date.innerHTML = msgDate ?? new Date().toLocaleTimeString();
  node.appendChild(date);
  const user = document.createElement("strong");
  user.innerHTML = username.toUpperCase() + ": ";
  const text = document.createTextNode(message);

  node.appendChild(user);
  node.appendChild(text);
  node.classList.add("text-gray-700", "py-1");

  document.getElementById("chat").appendChild(node);
}
