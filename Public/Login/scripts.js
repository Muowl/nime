document.getElementById('loginButton').addEventListener('click', () => {
    const emailOrUsername = document.getElementById('loginEmailOrUsername').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    const loginData = {
        emailOrUsername,
        password,
        rememberMe
    };

    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            if (rememberMe) {
                localStorage.setItem('user', JSON.stringify(data.user));
            } else {
                sessionStorage.setItem('user', JSON.stringify(data.user));
            }
            window.location.href = '/';
        } else {
            alert('Erro ao fazer login: ' + data.message);
        }
    })
    .catch(error => console.error('Erro:', error));
});

document.getElementById('registerButton').addEventListener('click', () => {
    window.location.href = '/cadastro';
});