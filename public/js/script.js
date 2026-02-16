
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
