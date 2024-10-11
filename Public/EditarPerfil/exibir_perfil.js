document.addEventListener('DOMContentLoaded', () => {
    function loadUserProfile() {
        const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
        if (!user) {
            window.location.href = '/login';
            return;
        }

        document.getElementById('nome').textContent = user.nome;
        document.getElementById('username').textContent = user.username;
        document.getElementById('email').textContent = user.email;
        document.getElementById('profileImage').src = user.imagem_perfil;
    }

    loadUserProfile();

    document.getElementById('backMain').addEventListener('click', () => {
        window.location.href = '/';
    });

    document.getElementById('editProfileButton').addEventListener('click', () => {
        window.location.href = '/perfil_cfg';
    });
});