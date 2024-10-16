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

document.getElementById('btnfiltrar').addEventListener('click', function() {
    alert("Filtrar função não implementada.");
});

document.getElementById('viewProfileButton').addEventListener('click', () => {
    window.location.href = '/perfil';
});

document.getElementById('btnSearch').addEventListener('click', function() {
    let searchValue = document.querySelector('input[type="text"]').value;
    alert("Você está procurando por: " + searchValue);
});