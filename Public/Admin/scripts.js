document.getElementById('loadTableButton').addEventListener('click', function() {
    const table = document.getElementById('tableSelect').value;
    fetch(`/api/tables/${table}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                renderTable(data.data, table);
            } else {
                alert('Erro ao obter dados da tabela');
            }
        })
        .catch(error => console.error('Erro:', error));
});

function renderTable(data, table) {
    const tableData = document.getElementById('tableData');
    tableData.innerHTML = '';

    if (data.length === 0) {
        tableData.innerHTML = '<p>Nenhum dado encontrado.</p>';
        return;
    }

    const tableElement = document.createElement('table');
    tableElement.className = 'table table-striped';

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    Object.keys(data[0]).forEach(key => {
        const th = document.createElement('th');
        th.textContent = key;
        headerRow.appendChild(th);
    });
    const thActions = document.createElement('th');
    thActions.textContent = 'Ações';
    headerRow.appendChild(thActions);
    thead.appendChild(headerRow);
    tableElement.appendChild(thead);

    const tbody = document.createElement('tbody');
    data.forEach(row => {
        const tr = document.createElement('tr');
        Object.values(row).forEach(value => {
            const td = document.createElement('td');
            td.textContent = value;
            tr.appendChild(td);
        });
        const tdActions = document.createElement('td');
        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.className = 'btn btn-warning btn-sm me-2';
        editButton.addEventListener('click', () => editEntity(table, row.id));
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Deletar';
        deleteButton.className = 'btn btn-danger btn-sm';
        deleteButton.addEventListener('click', () => deleteEntity(table, row.id));
        tdActions.appendChild(editButton);
        tdActions.appendChild(deleteButton);
        tr.appendChild(tdActions);
        tbody.appendChild(tr);
    });
    tableElement.appendChild(tbody);
    tableData.appendChild(tableElement);
}

function editEntity(table, id) {
    const newValues = prompt('Digite os novos valores no formato JSON (ex: {"nome": "Novo Nome"}):');
    if (newValues) {
        fetch(`/api/tables/${table}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: newValues
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Entidade editada com sucesso');
                document.getElementById('loadTableButton').click();
            } else {
                alert('Erro ao editar entidade');
            }
        })
        .catch(error => console.error('Erro:', error));
    }
}

function deleteEntity(table, id) {
    if (confirm('Tem certeza que deseja deletar esta entidade?')) {
        fetch(`/api/tables/${table}/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Entidade deletada com sucesso');
                document.getElementById('loadTableButton').click();
            } else {
                alert('Erro ao deletar entidade');
            }
        })
        .catch(error => console.error('Erro:', error));
    }
}

document.getElementById('addAnime').click(){
    window.location.href = '/insere';
}