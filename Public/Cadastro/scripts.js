document.getElementById('registerButton').addEventListener('click', () => {
    const nome = document.getElementById('nome').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    const user = {
        nome,
        username,
        email,
        senha
    };

    fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Cadastro realizado com sucesso! Redirecionando para a página de login...');
            setTimeout(() => {
                window.location.href = '/login';
            }, 4000); // Espera 4 segundos antes de redirecionar
        } else {
            alert('Erro ao cadastrar: ' + data.message);
        }
    })
    .catch(error => console.error('Erro:', error));
});

document.getElementById('loginButton').addEventListener('click', () => {
    window.location.href = '/login';
});