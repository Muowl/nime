document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname === '/perfil_cfg') {
        function loadProfileImages() {
            fetch('/Imagens')
                .then(response => response.json())
                .then(images => {
                    const profileImageOptions = document.getElementById('profileImageOptions');
                    profileImageOptions.innerHTML = '';

                    images.forEach(image => {
                        const col = document.createElement('div');
                        col.className = 'col-4 mb-3';
                        const img = document.createElement('img');
                        img.src = `/Imagens/${image}`;
                        img.className = 'img-thumbnail';
                        img.style.cursor = 'pointer';
                        img.addEventListener('click', () => {
                            document.getElementById('profileImage').src = img.src;
                            const modal = bootstrap.Modal.getInstance(document.getElementById('profileImageModal'));
                            modal.hide();
                        });
                        col.appendChild(img);
                        profileImageOptions.appendChild(col);
                    });
                })
                .catch(error => console.error('Erro ao carregar imagens:', error));
        }

        function loadUserProfile() {
            const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
            if (!user) {
                window.location.href = '/login';
                return;
            }

            document.getElementById('nome').value = user.nome;
            document.getElementById('username').value = user.username;
            document.getElementById('email').value = user.email;
            document.getElementById('profileImage').src = user.imagem_perfil;
        }

        function updateUserProfile() {
            const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
            if (!user) {
                window.location.href = '/login';
                return;
            }

            const updatedUser = {
                id: user.id,
                nome: document.getElementById('nome').value,
                username: document.getElementById('username').value,
                email: document.getElementById('email').value,
                imagem_perfil: document.getElementById('profileImage').src
            };

            fetch(`/api/user/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedUser)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Perfil atualizado com sucesso!');
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                    sessionStorage.setItem('user', JSON.stringify(updatedUser));
                } else {
                    alert('Erro ao atualizar perfil: ' + data.message);
                }
            })
            .catch(error => console.error('Erro:', error));
        }

        loadProfileImages();
        loadUserProfile();

        document.getElementById('saveProfileButton').addEventListener('click', updateUserProfile);
    }
});