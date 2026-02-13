function addMessage(text, type) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", type);
  msgDiv.textContent = text;

  const messages = document.getElementById("messages");
  messages.appendChild(msgDiv);
  messages.scrollTop = messages.scrollHeight;
}

async function send() {
  const input = document.getElementById("msg");
  const core = document.getElementById("core-select").value;
  const text = input.value.trim();

  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  addMessage("⌛ Processando...", "bot");

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: text,
        core: core
      })
    });

    const data = await res.json();

    const messages = document.getElementById("messages");
    messages.removeChild(messages.lastChild);

    addMessage(`[${data.core}] \n\n${data.reply}`, "bot");

  } catch (err) {
    addMessage("❌ Erro ao conectar com a API.", "bot");
  }
}
