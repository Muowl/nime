document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));

    if (!user) {
        window.location.href = '/login';
        return;
    }

    document.querySelector('.profile-section img').src = user.imagem_perfil;
    document.querySelector('.profile-section h4').textContent = user.nome.split(' ')[0];
    document.querySelector('.profile-section p').textContent = `@${user.username}`;

    fetch(`/api/user/${user.id}/exemplares`)
        .then(response => response.json())
        .then(data => {
            const recentlyAdded = document.querySelector('.recently-added');
            recentlyAdded.innerHTML = '';

            if (data.length === 0) {
                recentlyAdded.innerHTML = '<h3>Adicione um item a sua lista e volte aqui depois!</h3>';
                return;
            }

            data.slice(0, 3).forEach(exemplar => {
                const div = document.createElement('div');
                div.className = 'mb-4';
                div.innerHTML = `
                    <img src="${exemplar.imagem}" alt="${exemplar.nome}">
                    <h4>${exemplar.nome}</h4>
                    <p>Episódio ${exemplar.episodio_capitulo_assistido} - ${exemplar.episodio_capitulo_total}</p>
                `;
                recentlyAdded.appendChild(div);
            });
        })
        .catch(error => console.error('Erro:', error));
});

document.getElementById('editProfileButton').addEventListener('click', () => {
    window.location.href = '/perfil_cfg';
});

document.querySelector('.profile-section .btn:last-child').addEventListener('click', () => {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    window.location.href = '/login';
});