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

document.getElementById('btncustomizar').addEventListener('click', () => {
    window.location.href = '/customizar';
});

document.getElementById('btnpesquisar').addEventListener('click', () => {
    window.location.href = '/pesquisar';
});

document.getElementById('viewProfileButton').addEventListener('click', () => {
    window.location.href = '/perfil';
});

const itemSelect = document.getElementById('category');
const selectedItems = document.getElementById('selectedcategory');
function addItem(item) {/*...*/}

itemSelect.addEventListener('change', function () {
    const selectedItem = this.value;
    if (selectedItem) {
        addItem(selectedItem);
    }
    this.value = '';
});