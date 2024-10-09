document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
    if (!user) {
        window.location.href = '/login';
        return;
    }

    document.querySelector('.profile-section img').src = user.imagem_perfil;
    document.querySelector('.profile-section h4').textContent = user.nome.split(' ')[0];
    document.querySelector('.profile-section p').textContent = `@${user.username}`;
});

document.getElementById('btnvoltar').addEventListener('click', () => {
    window.location.href = '/';
});

document.querySelector('.btn-primary').addEventListener('click', function() {
    alert("Filtrar função não implementada.");
});