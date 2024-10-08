const cadastroButton = document.querySelector('button:last-child');
cadastroButton.addEventListener('click', () => {
    window.location.href = '/cadastro'; // Lembrar que o servidor precisa estar rodando para ser redirecionado
});