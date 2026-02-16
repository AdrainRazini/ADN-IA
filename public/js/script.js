
/* :) */
console.log("Sistema Ativo");

// Verifica se a página atual existe; se não, redireciona para 404.html
window.addEventListener('DOMContentLoaded', () => {
    const urlAtual = window.location.pathname;

    fetch(urlAtual, { method: 'HEAD' })
        .then(response => {
            if (!response.ok) {
                window.location.href = "404.html";
            }
            // Se a página existe, não faz nada
        })
        .catch(error => {
            console.error("Erro ao verificar a URL:", error);
            window.location.href = "404.html";
        });
});



// === 🔹 MENU HAMBÚRGUER e TOOLTIP (inalterado) ===
const hamburger = document.getElementById("hamburgerMenu");
const sideMenu = document.getElementById("sideMenu");
const overlay = document.getElementById("menuOverlay");

hamburger.addEventListener("click", () => {
  const active = hamburger.classList.toggle("active");
  sideMenu.classList.toggle("active", active);
  overlay.classList.toggle("active", active);
});

overlay.addEventListener("click", () => {
  hamburger.classList.remove("active");
  sideMenu.classList.remove("active");
  overlay.classList.remove("active");
});


