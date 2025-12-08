async function send() {
  const text = document.getElementById("msg").value;

  if (!text.trim()) return;

  // Mostra texto temporário enquanto espera a resposta
  document.getElementById("resp").textContent = "⌛ Processando...";

  const res = await fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text })
  });

  const data = await res.json();

  document.getElementById("resp").textContent = data.reply;
}
